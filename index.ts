import { Project } from './src/class/Project'
import { IProject, UserRole, ProjectStatus } from './src/class/Project'

const showModal = (id: string) => {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement)
    modal.showModal()
}

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
    const project = new Project(projectData)
    console.log(project)
  })
} else {
  console.log('The Project form was not found')
}
