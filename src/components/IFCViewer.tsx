import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as THREE from 'three'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'

export function IFCViewer() {
  const components = new OBC.Components()
  const setViewer = () => {
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBCF.PostproductionRenderer>()

    const viewerContainer = document.getElementById('viewer-container') as HTMLElement

    world.scene = new OBC.SimpleScene(components)
    const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer)
    world.renderer = rendererComponent
    const cameraComponent = new OBC.SimpleCamera(components)
    world.camera = cameraComponent

    components.init()

    world.scene.setup()

    world.renderer.postproduction.enabled = true

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

    //! Highlighter is not working
    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup({ world })

    // highlighter.zoomToSelection = true

    viewerContainer.addEventListener('resize', () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })
  }

  const setupUI = () => {
    const viewerContainer = document.getElementById('viewer-container') as HTMLElement
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

  return <bim-viewport id='viewer-container' />
}
