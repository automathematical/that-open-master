import React, { useEffect } from 'react'
import { IProject, Project, UserRole, ProjectStatus } from '../classes/Project'
import { ProjectManager } from '../classes/ProjectManager'
import { ProjectCard } from './ProjectCard'
import * as Router from 'react-router-dom'
import * as Firestore from 'firebase/firestore'
import SearchBox from './SearchBox'
import Empty from './Empty'
import { getCollection } from '../firebase'
import * as BUI from '@thatopen/ui'

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
        const existingProject = props.projectManager.list.find((p) => p.name === project.name)
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
      Firestore.addDoc(projectCollection, projectData)
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

  const importBtn = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        id='import-projects-btn'
        @click=${onImportClick}
        icon='iconoir:import'></bim-button>`
  })

  const exportBtn = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        id='import-projects-btn'
        @click=${onExportClick}
        icon='ph:export'></bim-button>
    `
  })

  const newProjectBtn = BUI.Component.create<BUI.Button>(() => {
    return BUI.html` 
      <bim-button
        @click=${onNewProjectClick}
        id='new-project-btn'
        icon='fluent:add-20-regular'></bim-button>
    `
  })

  React.useEffect(() => {
    const projectControls = document.getElementById('project-page-controls')
    projectControls?.appendChild(importBtn)
    projectControls?.appendChild(exportBtn)
    projectControls?.appendChild(newProjectBtn)

    const cancelBtn = document.getElementById('cancel-btn')
    cancelBtn?.addEventListener('click', onCancelClick)
  }, [])

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
                <bim-label className='material-icons-round'>apartment</bim-label>Name
              </label>
              <bim-text-input
                name='name'
                type='text'
                placeholder="What's the name of your project?"
              />
              <bim-label
                style={{
                  color: 'gray',
                  fontSize: 'var(--font-sm)',
                  marginTop: 5,
                  fontStyle: 'italic',
                }}>
                TIP: Give it a short name
              </bim-label>
              <p id='error' />
            </div>
            <div className='form-field-container'>
              <label>
                <bim-label className='material-icons-round'>subject</bim-label>Description
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
              <bim-label
                icon='material-symbols:person'
                style={{ marginBottom: 5 }}>
                Role
              </bim-label>
              <bim-dropdown name='userRole'>
                <bim-option
                  label='Architect'
                  checked></bim-option>
                <bim-option label='Engineer'></bim-option>
                <bim-option label='Developer'></bim-option>
              </bim-dropdown>
            </div>
            <div className='form-field-container'>
              <bim-label
                icon='material-symbols:info'
                style={{ marginBottom: 5 }}>
                Status
              </bim-label>
              <bim-dropdown name='status'>
                <bim-option
                  label='Pending'
                  checked></bim-option>
                <bim-option label='Active'></bim-option>
                <bim-option label='Finished'></bim-option>
              </bim-dropdown>
            </div>
            <div className='form-field-container'>
              <bim-label
                icon='mdi:calendar'
                name='finishDate'>
                Finish Date
              </bim-label>

              <bim-text-input
                name='finishDate'
                type='date'
              />
            </div>
            <div
              style={{
                display: 'flex',
                margin: '10px 0px 10px auto',
                columnGap: 10,
              }}>
              <bim-button
                type='button'
                label='cancel'
                id='cancel-btn'></bim-button>
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
        <bim-label>Projects</bim-label>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
        <div
          style={{ display: 'flex', flexDirection: 'row' }}
          id='project-page-controls'></div>
      </header>
      <div id='projects-list'>{projects.length > 0 ? projectCards : <Empty />}</div>
    </div>
  )
}
