import { ErrorMessage } from '../src/class/ErrorMessage'
import { IProject, UserRole, ProjectStatus } from '../src/class/Project'
import { ProjectManager } from '../src/class/ProjectManager'

const projectListUI = document.getElementById('projects-list') as HTMLElement
const projectManager = new ProjectManager(projectListUI)
console.log('initial list', projectManager.list);

function toggleModal(active: boolean, id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    active ? modal.showModal() : modal.close()
  } else {
    console.warn("the provided modal wasn't found. ID: ", id);
  }
}

const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'new-project-modal')
  })
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
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string,
    }
    try {
      projectManager.createProject(projectData)
      projectForm.reset()
      toggleModal(false, "new-project-modal")
      console.log('updated list', projectManager.list)
    } catch (error) {
      projectForm.reset();
      (new ErrorMessage(projectForm, error)).showError()
    }
  })
} else {
  console.log('The Project form was not found')
}

const cancelBtnNew = document.getElementById('cancel-btn-new')
if (cancelBtnNew) {
  cancelBtnNew.addEventListener('click', () => {
    toggleModal(false, 'new-project-modal')
  })
}

const editProjectBtn = document.getElementById('edit-project-btn')
if (editProjectBtn) {
  editProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'edit-project-modal')
  })
}

const editForm = document.getElementById('edit-project-form')
if (editForm && editForm instanceof HTMLFormElement) {
  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(editForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string
    }
    try {
      projectManager.createProject(projectData)
      console.log('Project updated');
      editForm.reset()
      toggleModal(false, "edit-project-modal")

      console.log('updated list', projectManager.list)
    } catch (error) {
      editForm.reset();
      (new ErrorMessage(editForm, error)).showError()
    }
  })
}

const cancelBtnEdit = document.getElementById('cancel-btn-edit')
if (cancelBtnEdit) {
  cancelBtnEdit.addEventListener('click', () => {
    toggleModal(false, 'edit-project-modal')
  })
}

const newToDoBtn = document.getElementById('new-todo-btn')
if (newToDoBtn) {
  newToDoBtn.addEventListener('click', () => {
    console.log('new todo');
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
