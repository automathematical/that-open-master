import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as THREE from 'three'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'

export function IFCViewer() {
  const components = new OBC.Components()
  const setViewer = async () => {
    const worlds = components.get(OBC.Worlds)
    console.log(worlds)

    const world = worlds.create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>()
    console.log(world)

    world.scene = new OBC.SimpleScene(components)
    world.scene.setup()

    const viewerContainer = document.getElementById('viewer-container') as HTMLCanvasElement
    const rendererComponent = new OBC.SimpleRenderer(components, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent

    components.init()

    // const material = new THREE.MeshLambertMaterial({ color: '#6528D7' })
    // const geometry = new THREE.BoxGeometry()
    // const cube = new THREE.Mesh(geometry, material)
    // world.scene.three.add(cube)

    world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0)

    const IfcLoader = components.get(OBC.IfcLoader)
    IfcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager)
    fragmentsManager.onFragmentsLoaded.add((model) => {
      world.scene.three.add(model)
    })

    // const fragments = new OBC.FragmentsManager(components)
    // const file = await fetch('https://thatopen.github.io/engine_components/resources/small.frag')
    // const data = await file.arrayBuffer()
    // const buffer = new Uint8Array(data)
    // const model = fragments.load(buffer)
    // world.scene.three.add(model)

    //! Highlighter is not working
    const highlighter = components.get(OBCF.Highlighter)
    // highlighter.setup({ world })

    viewerContainer.addEventListener('resize', () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })
  }

  const setupUI = () => {
    const viewerContainer = document.getElementById('viewer-container') as HTMLCanvasElement
    if (!viewerContainer) return

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px">
         </bim-grid>
      `
    })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components })
      return BUI.html`
        <bim-toolbar style="justify-self: center">
        <bim-toolbar-section>
        ${loadIfcBtn}
        </bim-toolbar-section>
        </bim-toolbar>
      `
    })

    floatingGrid.layouts = {
      main: {
        template: `
          "empty" 1fr
          "toolbar" auto
          /1fr
     
     `,
        elements: {
          toolbar,
        },
      },
    }
    floatingGrid.layout = 'main'

    viewerContainer.appendChild(floatingGrid)
  }

  React.useEffect(() => {
    setViewer()
    setupUI()
    return () => {
      components.dispose()
    }
  }, [])

  return <bim-viewport id='viewer-container'></bim-viewport>
}
