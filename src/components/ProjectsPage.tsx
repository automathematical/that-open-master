import React, { useEffect } from 'react'
import { IProject, Project } from '../classes/Project'
import { ProjectManager } from '../classes/ProjectManager'
import { ProjectCard } from './ProjectCard'
import * as Router from 'react-router-dom'
import * as Firestore from 'firebase/firestore'
import SearchBox from './SearchBox'
import Empty from './Empty'
import { getCollection } from '../firebase'
import ProjectForm from './ProjectForm'

interface Props {
  projectManager: ProjectManager
}

const projectCollection = getCollection<IProject>('/projects')

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(props.projectManager.list)
  props.projectManager.onProjectCreated = () => {
    setProjects([...props.projectManager.list])
    console.log('Project created')
  }

  const getFirebaseProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectCollection)
    for (const doc of firebaseProjects.docs) {
      const data = doc.data()
      const project: IProject = {
        ...data,
        finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate(),
      }
      try {
        props.projectManager.newProject(project, doc.id)
      } catch (error) {
        const existingProject = props.projectManager.list.find(p => p.name === project.name)
        if (existingProject) {
          props.projectManager.updateProject(existingProject)
          throw new Error('project with samen name already exists')
        }
      }
    }
  }

  useEffect(() => {
    getFirebaseProjects()
  }, [])

  const projectCards = projects.map(project => {
    return (
      <Router.Link
        to={`/project/${project.id}`}
        key={project.id}>
        <ProjectCard
          key={project.id}
          project={project}
        />
      </Router.Link>
    )
  })

  React.useEffect(() => {
    console.log('projects state updated', projects)
  }, [projects])

  const onNewProjectClick = () => {
    const modal = document.getElementById('new-project-modal')
    if (!(modal && modal instanceof HTMLDialogElement)) {
      return
    }
    modal.showModal()
  }

  const onImportClick = () => {
    props.projectManager.importFromJSON()
  }

  const onExportClick = () => {
    props.projectManager.exportProject()
  }

  const onProjectSearch = (value: string) => {
    setProjects(props.projectManager.filterProjects(value))
  }

  return (
    <div
      className='page'
      id='projects-page'>
      <ProjectForm projectManager={props.projectManager} />

      <header>
        <h2>Projects</h2>
        <SearchBox onChange={value => onProjectSearch(value)} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <button
            onClick={onImportClick}
            id='import-projects-btn'>
            <span className='material-icons-round action-icon'>download</span>
          </button>
          <button
            onClick={onExportClick}
            id='export-projects-btn'>
            <span className='material-icons-round action-icon'>upload</span>
          </button>
          <button
            onClick={onNewProjectClick}
            id='new-project-btn'>
            <span className='material-icons-round'>add</span>New Project
          </button>
        </div>
      </header>
      <div id='projects-list'>{projects.length > 0 ? projectCards : <Empty />}</div>
    </div>
  )
}
