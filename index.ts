import { IProject, UserRole, ProjectStatus } from './src/class/Project'
import { ProjectManager } from './src/class/ProjectManager'

const showModal = (id: string) => {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.log("the provided modal wasn't found. ID: ", id);
  }
}
const closeModal = (id: string) => {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.log("the provided modal wasn't found. ID: ", id);
  }
}

const projectListUI = document.getElementById('projects-list') as HTMLElement
const projectManager = new ProjectManager(projectListUI)

// this is the document ..
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    showModal('new-project-modal')
  })
} else {
  console.log('New Projects button was not found')
}

const projectForm = document.getElementById('new-project-form')
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('role') as UserRole,
      finishDate: new Date(('finishDate') as string),
    }
    const project = projectManager.newProject(projectData)
    projectForm.reset()
    console.log(project)
  })
} else {
  console.log('The Project form was not found')
}
