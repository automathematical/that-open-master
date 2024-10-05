import * as React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as OBC from 'openbim-components'
import { FragmentsGroup } from 'bim-fragment'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export function ThreeViewer() {
  let threeScene: THREE.Scene | null
  let camera: THREE.PerspectiveCamera | null
  let renderer: THREE.WebGLRenderer | null
  let mesh: THREE.Object3D | null
  let directionalLight: THREE.DirectionalLight | null
  let ambientLight: THREE.AmbientLight | null
  let cameraControls: OrbitControls | null
  let axes: THREE.AxesHelper | null
  let grid: THREE.GridHelper | null
  let gui: GUI | null
  let cubeControls: GUI | null
  let objLoader: OBJLoader | null
  let mtlLoader: MTLLoader | null

  const setViewer = () => {
    //three js viewer
    threeScene = new THREE.Scene()

    const viewerContainerElement = document.getElementById('viewer-container') as HTMLElement

    camera = new THREE.PerspectiveCamera(75)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ alpha: true })
    viewerContainerElement.append(renderer.domElement)

    function resizeViewer() {
      if (!renderer || !camera) return
      const containerDimensions = viewerContainerElement.getBoundingClientRect()
      renderer.setSize(containerDimensions.width, containerDimensions.height)
      const aspectRatio = containerDimensions.width / containerDimensions.height
      camera.aspect = aspectRatio
      camera.updateProjectionMatrix
    }

    window.addEventListener('resize', resizeViewer)

    resizeViewer()

    directionalLight = new THREE.DirectionalLight()
    ambientLight = new THREE.AmbientLight()
    ambientLight.intensity = 0.4

    threeScene.add(directionalLight, ambientLight)

    cameraControls = new OrbitControls(camera, viewerContainerElement)

    function renderScene() {
      if (!renderer || !threeScene || !camera) return
      renderer.render(threeScene, camera)
      requestAnimationFrame(renderScene)
    }

    renderScene()

    axes = new THREE.AxesHelper()
    grid = new THREE.GridHelper()
    grid.material.transparent = true
    grid.material.opacity = 0.4
    grid.material.color = new THREE.Color('#808080')

    threeScene.add(axes, grid)

    // gui = new GUI()

    objLoader = new OBJLoader()
    mtlLoader = new MTLLoader()

    mtlLoader.load('../assets/Gear/Gear1.mtl', (materials) => {
      if (!objLoader) return
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load('../assets/Gear/Gear1.obj', (object) => {
        if (!threeScene) return
        threeScene.add(object)
        mesh = object
      })
    })

    // viewer = new OBC.Components()

    // sceneComponent = new OBC.SimpleScene(viewer)
    // sceneComponent.setup()
    // viewer.scene = sceneComponent
    // const scene = sceneComponent.get()
    // scene.background = null

    // const viewerContainerDiv = document.getElementById('viewer-container') as HTMLDivElement
    // const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainerDiv)
    // viewer.renderer = rendererComponent

    // const cameraComponent = new OBC.SimpleCamera(viewer)
    // viewer.camera = cameraComponent

    // const raycasterComponent = new OBC.SimpleRaycaster(viewer)
    // viewer.raycaster = raycasterComponent

    // viewer.init()
    // cameraComponent.updateAspect()
    // rendererComponent.postproduction.enabled = true

    // const fragmentManager = new OBC.FragmentManager(viewer)

    // function exportFragments(model: FragmentsGroup) {
    //   const fragmentsBinary = fragmentManager.export(model)
    //   const blob = new Blob([fragmentsBinary])
    //   const url = URL.createObjectURL(blob)
    //   const a = document.createElement('a')
    //   a.href = url
    //   a.download = `${model.name.replace('.ifc', '')}.frag`
    //   a.click()
    //   URL.revokeObjectURL(url)
    // }

    // const ifcLoader = new OBC.FragmentIfcLoader(viewer)
    // ifcLoader.settings.wasm = {
    //   path: 'https://unpkg.com/web-ifc@0.0.43/',
    //   absolute: true,
    // }

    // const highlighter = new OBC.FragmentHighlighter(viewer)
    // highlighter.setup()

    // const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
    // highlighter.events.select.onClear.add(() => {
    //   propertiesProcessor.cleanPropertiesList()
    // })

    // const classifier = new OBC.FragmentClassifier(viewer)

    // const classificationsWindow = new OBC.FloatingWindow(viewer)
    // classificationsWindow.visible = false
    // viewer.ui.add(classificationsWindow)
    // classificationsWindow.title = 'model groups'

    // const classificationBtn = new OBC.Button(viewer)
    // classificationBtn.materialIcon = 'account_tree'

    // classificationBtn.onClick.add(() => {
    //   classificationsWindow.visible = !classificationsWindow.visible
    //   classificationBtn.active = classificationBtn.visible
    // })

    // async function createModelTree() {
    //   const fragmentTree = new OBC.FragmentTree(viewer)
    //   await fragmentTree.init()
    //   await fragmentTree.update(['storeys', 'entities'])
    //   const tree = fragmentTree.get().uiElement.get('tree')
    //   fragmentTree.onHovered.add((fragmentMap) => {
    //     highlighter.highlightByID('hover', fragmentMap)
    //   })
    //   fragmentTree.onSelected.add((fragmentMap) => {
    //     highlighter.highlightByID('select', fragmentMap)
    //   })
    //   return tree
    // }

    // async function onModelLoaded(model: FragmentsGroup) {
    //   highlighter.update()

    //   try {
    //     classifier.byStorey(model)
    //     classifier.byEntity(model)
    //     const tree = await createModelTree()
    //     await classificationsWindow.slots.content.dispose(true)
    //     classificationsWindow.addChild(tree)

    //     propertiesProcessor.process(model)
    //     highlighter.events.select.onHighlight.add((fragmentMap) => {
    //       const expressID = [...Object.values(fragmentMap)[0]][0]
    //       propertiesProcessor.renderProperties(model, Number(expressID))
    //     })
    //   } catch (error) {
    //     alert(error)
    //   }
    // }

    // ifcLoader.onIfcLoaded.add(async (model) => {
    //   exportFragments(model)
    //   exportJsonProperties(model)
    //   onModelLoaded(model)
    // })

    // fragmentManager.onFragmentsLoaded.add((model) => {
    //   onModelLoaded(model)
    // })
    // fragmentManager.onFragmentsLoaded.add((model) => {
    //   importJsonProperties(model)
    // })

    // const importFragmentBtn = new OBC.Button(viewer)
    // importFragmentBtn.materialIcon = 'upload'
    // importFragmentBtn.tooltip = 'Load Frag'

    // importFragmentBtn.onClick.add(() => {
    //   const input = document.createElement('input')
    //   input.type = 'file'
    //   input.accept = '.frag'
    //   const reader = new FileReader()
    //   reader.addEventListener('load', async () => {
    //     const binary = reader.result
    //     if (!(binary instanceof ArrayBuffer)) {
    //       return
    //     }
    //     const fragmentBinary = new Uint8Array(binary)
    //     await fragmentManager.load(fragmentBinary)
    //   })
    //   input.addEventListener('change', () => {
    //     const filesList = input.files
    //     if (!filesList) {
    //       return
    //     }
    //     reader.readAsArrayBuffer(filesList[0])
    //   })
    //   input.click()
    // })

    // function exportJsonProperties(model: FragmentsGroup) {
    //   console.log('exporting json')

    //   const json = JSON.stringify(model.properties, null, 2)
    //   const blob = new Blob([json], { type: 'application/json' })
    //   const url = URL.createObjectURL(blob)
    //   const a = document.createElement('a')
    //   a.href = url
    //   a.download = `${model.name.replace('.ifc', '')}.json`
    //   a.click()
    //   URL.revokeObjectURL(json)
    // }

    // function importJsonProperties(model) {
    //   console.log('importing')

    //   const input = document.createElement('input')
    //   input.type = 'file'
    //   input.accept = 'application/json'
    //   const reader = new FileReader()
    //   reader.addEventListener('load', () => {
    //     const json = reader.result as string
    //     if (!json) {
    //       return
    //     }
    //     const enrichModel = (model.properties = JSON.parse(json))
    //     onModelLoaded(enrichModel)
    //     return
    //   })
    //   input.addEventListener('change', () => {
    //     const filesList = input.files
    //     if (!filesList) {
    //       return
    //     }
    //     reader.readAsText(filesList[0])
    //   })
    //   input.click()
    // }

    // const toolbar = new OBC.Toolbar(viewer)
    // toolbar.addChild(
    //   ifcLoader.uiElement.get('main'),
    //   classificationBtn,
    //   propertiesProcessor.uiElement.get('main'),
    //   importFragmentBtn
    // )

    // viewer.ui.addToolbar(toolbar)
  }
  React.useEffect(() => {
    setViewer()
    return () => {
      // cleanup

      mesh?.removeFromParent()
      mesh?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          child.material.dispose()
        }
      })
      mesh
    }
  }, [])

  return (
    <div
      id='viewer-container'
      className='dashboard-card'
      style={{ minWidth: 0, position: 'relative', height: '80vh' }}
    />
  )
}
