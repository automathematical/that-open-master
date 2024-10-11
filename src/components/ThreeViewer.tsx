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
