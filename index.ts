import * as THREE from 'three'
import { ErrorMessage } from './src/class/ErrorMessage'
import { IProject, UserRole, ProjectStatus } from './src/class/Project'
import { ProjectManager } from './src/class/ProjectManager'


const projectListUI = document.getElementById('projects-list') as HTMLElement
const projectManager = new ProjectManager(projectListUI)

function toggleModal(active: boolean, id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    active ? modal.showModal() : modal.close()
  } else {
    console.warn("the provided modal wasn't found. ID: ", id);
  }
}

// this is the document ..
// open the project modal by clicking the new project button
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'new-project-modal')
  })
} else {
  console.log('New projects button was not found')
}

// function updateForm(id) {
//   toggleModal(true, id)
// }

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

      const editProjectBtn = document.getElementById('edit-project-btn')
      if (editProjectBtn) {
        editProjectBtn.addEventListener('click', () => {
          if (project.id != null) {
            console.log('project deleted');
            projectManager.deleteProject(project.id)
          }
          // toggleModal(true, 'new-project-modal')
        })
      }

      // Cancel button
      projectForm.addEventListener("click", () => {
        toggleModal(false, "new-project-modal")
      })
    } catch (error) {
      projectForm.reset();
      (new ErrorMessage(projectForm, error)).showError()
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

//three js viewer
const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement
const containerDimensions = viewerContainer.getBoundingClientRect()
const aspectRatio = containerDimensions.width / containerDimensions.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
viewerContainer.append(renderer.domElement)
renderer.setSize(containerDimensions.width, containerDimensions.height)


const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()

scene.add(cube, directionalLight, ambientLight)

renderer.render(scene, camera)