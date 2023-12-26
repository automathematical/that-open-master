import * as OBC from 'openbim-components'
import { FragmentsGroup } from 'bim-fragment'
import { ErrorMessage } from './src/class/ErrorMessage'
import { IProject, UserRole, ProjectStatus } from './src/class/Project'
import { ProjectManager } from './src/class/ProjectManager'

// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

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
      finishDate: new Date(formData.get("finishDate") as string)
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
// const scene = new THREE.Scene()

// const viewerContainer = document.getElementById("viewer-container") as HTMLElement

// const camera = new THREE.PerspectiveCamera(75)
// camera.position.z = 5

// const renderer = new THREE.WebGLRenderer({ alpha: true })
// viewerContainer.append(renderer.domElement)

// function resizeViewer() {
//   const containerDimensions = viewerContainer.getBoundingClientRect()
//   renderer.setSize(containerDimensions.width, containerDimensions.height)
//   const aspectRatio = containerDimensions.width / containerDimensions.height
//   camera.aspect = aspectRatio
//   camera.updateProjectionMatrix
// }

// window.addEventListener("resize", resizeViewer)

// resizeViewer()

// BOX OR CUBE GEOMETRY FROM THREE JS LIB
// const boxGeometry = new THREE.BoxGeometry()
// const material = new THREE.MeshStandardMaterial()
// const cube = new THREE.Mesh(boxGeometry, material)

// const directionalLight = new THREE.DirectionalLight()
// const ambientLight = new THREE.AmbientLight()
// ambientLight.intensity = 0.4

// scene.add(cube, directionalLight, ambientLight)

// const cameraControls = new OrbitControls(camera, viewerContainer)

// function renderScene() {

//   renderer.render(scene, camera)
//   requestAnimationFrame(renderScene)
// }

// renderScene()

// const axes = new THREE.AxesHelper()
// const grid = new THREE.GridHelper()
// grid.material.transparent = true
// grid.material.opacity = 0.4
// grid.material.color = new THREE.Color("#808080")

// scene.add(axes, grid)

// const gui = new GUI()

// const cubeControls = gui.addFolder("Cube")
// cubeControls.add(cube.position, "x", -10, 10, 1)
// cubeControls.add(cube.position, "y", -10, 10, 1)
// cubeControls.add(cube.position, "z", -10, 10, 1)
// cubeControls.add(cube, 'visible')

// const objLoader = new OBJLoader()
// const mtlLoader = new MTLLoader()


// mtlLoader.load('../assets/Gear/Gear1.mtl', (materials) => {
//   materials.preload()
//   objLoader.setMaterials(materials)
//   objLoader.load('../assets/Gear/Gear1.obj', (mesh) => {
//     scene.add(mesh)
//   })
// })

const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById('viewer-container') as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.SimpleCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const fragmentManager = new OBC.FragmentManager(viewer)

function exportFragments(model: FragmentsGroup) {
  const fragmentsBinary = fragmentManager.export(model)
  const blob = new Blob([fragmentsBinary])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${model.name.replace(".ifc", '')}.frag`
  a.click()
  URL.revokeObjectURL(url)
}


const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList()
})

const classifier = new OBC.FragmentClassifier(viewer)

const classificationsWindow = new OBC.FloatingWindow(viewer)
classificationsWindow.visible = false
viewer.ui.add(classificationsWindow)
classificationsWindow.title = "model groups"

const classificationBtn = new OBC.Button(viewer)
classificationBtn.materialIcon = "account_tree"

classificationBtn.onClick.add(() => {
  classificationsWindow.visible = !classificationsWindow.visible
  classificationBtn.active = classificationBtn.visible
})

async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update(["storeys", "entities"])
  const tree = fragmentTree.get().uiElement.get("tree")
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap)
  })
  return tree
}

async function onModelLoaded(model: FragmentsGroup) {
  highlighter.update()

  try {
    classifier.byStorey(model)
    classifier.byEntity(model)
    const tree = await createModelTree()
    await classificationsWindow.slots.content.dispose(true)
    classificationsWindow.addChild(tree)

    propertiesProcessor.process(model)
    highlighter.events.select.onHighlight.add((fragmentMap) => {
      const expressID = [...Object.values(fragmentMap)[0]][0]
      propertiesProcessor.renderProperties(model, Number(expressID))
    })

  } catch (error) {
    alert(error)
  }
}

ifcLoader.onIfcLoaded.add(async (model) => {
  exportFragments(model)
  exportJsonProperties(model)
  onModelLoaded(model)
})

fragmentManager.onFragmentsLoaded.add((model) => {
  onModelLoaded(model)
})
fragmentManager.onFragmentsLoaded.add((model) => {
  importJsonProperties(model)
})

const importFragmentBtn = new OBC.Button(viewer)
importFragmentBtn.materialIcon = "upload"
importFragmentBtn.tooltip = "Load Frag"

importFragmentBtn.onClick.add(() => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.frag'
  const reader = new FileReader()
  reader.addEventListener("load", async () => {
    const binary = reader.result
    if (!(binary instanceof ArrayBuffer)) { return }
    const fragmentBinary = new Uint8Array(binary)
    await fragmentManager.load(fragmentBinary)
  })
  input.addEventListener('change', () => {
    const filesList = input.files
    if (!filesList) { return }
    reader.readAsArrayBuffer(filesList[0])
  })
  input.click()
})

function exportJsonProperties(model: FragmentsGroup) {
  console.log("exporting json");

  const json = JSON.stringify(model.properties, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${model.name.replace(".ifc", "")}.json`
  a.click()
  URL.revokeObjectURL(json)
}

function importJsonProperties(model) {
  console.log("importing");

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    const json = reader.result as string
    if (!json) { return }
    const enrichModel = model.properties = JSON.parse(json)
    onModelLoaded(enrichModel)
    return
  })
  input.addEventListener('change', () => {
    const filesList = input.files
    if (!filesList) { return }
    reader.readAsText(filesList[0])
  })
  input.click()
}

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get('main'),
  classificationBtn,
  propertiesProcessor.uiElement.get('main'),
  importFragmentBtn
)

viewer.ui.addToolbar(toolbar)