import React, { useEffect } from 'react'
import { IProject, Project, UserRole, ProjectStatus } from '../classes/Project'
import { ProjectManager } from '../classes/ProjectManager'
import { ProjectCard } from './ProjectCard'
import * as Router from 'react-router-dom'
import * as Firestore from 'firebase/firestore'
import SearchBox from './SearchBox'
import Empty from './Empty'
import { firebaseDB } from '../firebase'

interface Props {
  projectManager: ProjectManager
}

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(props.projectManager.list)
  props.projectManager.onProjectCreated = () => {
    setProjects([...props.projectManager.list])
    console.log('Project created')
  }
  props.projectManager.onProjectDeleted = () => {
    setProjects([...props.projectManager.list])
  }

  const getFirebaseProjects = async () => {
    const projectCollection = Firestore.collection(firebaseDB, '/projects') as Firestore.CollectionReference<IProject>
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
        const existingProject = props.projectManager.list.find((p) => p.name === project.name)
        if (existingProject) {
          props.projectManager.updateProject(existingProject)
          throw new Error('project with samen name already exists')
        } else {
          props.projectManager.newProject(project, doc.id)
        }
      }
    }
  }

  useEffect(() => {
    getFirebaseProjects()
  }, [])

  const projectCards = projects.map((project) => {
    return (
      <Router.Link
        to={`/project/${project.id}`}
        key={project.id}>
        <ProjectCard project={project} />
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

  const onCancelClick = () => {
    const modal = document.getElementById('new-project-modal')
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    }
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const projectForm = document.getElementById('new-project-form')
    if (!(projectForm && projectForm instanceof HTMLFormElement)) {
      return
    }

    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date(formData.get('finishDate') as string),
    }

    try {
      const project = props.projectManager.newProject(projectData)
      projectForm.reset()
      const modal = document.getElementById('new-project-modal')
      if (!(modal && modal instanceof HTMLDialogElement)) {
        return
      }
      modal.close()
    } catch (error) {
      alert(error)
    }
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
      <dialog id='new-project-modal'>
        <form
          onSubmit={onFormSubmit}
          id='new-project-form'>
          <h2>New Project</h2>
          <div className='input-list'>
            <div className='form-field-container'>
              <label>
                <span className='material-icons-round'>apartment</span>Name
              </label>
              <input
                name='name'
                type='text'
                placeholder="What's the name of your project?"
              />
              <p
                style={{
                  color: 'gray',
                  fontSize: 'var(--font-sm)',
                  marginTop: 5,
                  fontStyle: 'italic',
                }}>
                TIP: Give it a short name
              </p>
              <p id='error' />
            </div>
            <div className='form-field-container'>
              <label>
                <span className='material-icons-round'>subject</span>Description
              </label>
              <textarea
                name='description'
                cols={30}
                rows={5}
                placeholder='Give your project a nice description! So people is jealous about it.'
                defaultValue={''}
              />
            </div>
            <div className='form-field-container'>
              <label>
                <span className='material-icons-round'>person</span>Role
              </label>
              <select name='userRole'>
                <option>Architect</option>
                <option>Engineer</option>
                <option>Developer</option>
              </select>
            </div>
            <div className='form-field-container'>
              <label>
                <span className='material-icons-round'>not_listed_location</span>
                Status
              </label>
              <select name='status'>
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className='form-field-container'>
              <label htmlFor='finishDate'>
                <span className='material-icons-round'>calendar_month</span>
                Finish Date
              </label>
              <input
                name='finishDate'
                type='date'
                defaultValue='2024-01-01'
              />
            </div>
            <div
              style={{
                display: 'flex',
                margin: '10px 0px 10px auto',
                columnGap: 10,
              }}>
              <button
                onClick={onCancelClick}
                type='button'
                value='cancel'
                style={{ backgroundColor: 'transparent' }}>
                Cancel
              </button>
              <button
                type='submit'
                style={{ backgroundColor: 'rgb(18, 145, 18)' }}>
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <h2>Projects</h2>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
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
