import { ErrorMessage } from './src/class/ErrorMessage'
import { IProject, UserRole, ProjectStatus } from './src/class/Project'
import { ProjectManager } from './src/class/ProjectManager'

function toggleModal(active: boolean, id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    active ? modal.showModal() : modal.close()
  } else {
    console.warn("the provided modal wasn't found. ID: ", id);
  }
}

const projectListUI = document.getElementById('projects-list') as HTMLElement
const projectManager = new ProjectManager(projectListUI)

// this is the document ..
// open the project modal by clicking the new project button
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'new-project-modal')
  })
} else {
  console.log('New Projects button was not found')
}

// get the html form and new formData -> projectData
const projectForm = document.getElementById('new-project-form')
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date('finishDate')
    }

    try {
      const project = projectManager.newProject(projectData)
      projectForm.reset()
      toggleModal(false, "new-project-modal")
      console.log(project);


      // Cancel button
      projectForm.addEventListener("click", (e) => {
        const button = e.target as HTMLButtonElement
        if (button.value == "cancel") {
          if (projectForm instanceof HTMLFormElement) {
            projectForm.reset()
            toggleModal(false, "new-project-modal")
          }
        }
      })
    } catch (error) {
      projectForm.reset();
      const errordisp = new ErrorMessage(projectForm, error)
      errordisp.showError()
      // (document.getElementById('error') as HTMLElement).innerHTML = `<div style='background-color:red'>${err}</div>`
    }
  })
} else {
  console.log('The Project form was not found')
}

const newToDoBtn = document.getElementById('new-todo-btn')
if (newToDoBtn) {
  newToDoBtn.addEventListener('click', () => {
    console.log('new todooo');
  })
}

const editProjectBtn = document.getElementById('edit-project-btn')
if (editProjectBtn) {
  editProjectBtn.addEventListener('click', () => {
    console.log('edit clicked');
  })
}

const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectManager.exportProject()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectManager.importFromJSON()
  })
}
