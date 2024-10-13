import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as THREE from 'three'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'

export function IFCViewer() {
  const components = new OBC.Components()
  const fragments = components.get(OBC.FragmentsManager)

  const setViewer = () => {
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>()
    components.init()

    world.scene = new OBC.SimpleScene(components)
    world.scene.setup()

    const viewerContainer = document.getElementById('viewer-container') as HTMLElement
    const rendererComponent = new OBC.SimpleRenderer(components, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent

    world.camera.controls.setLookAt(12, 6, 8, 0, 0, 0)

    const grids = components.get(OBC.Grids)
    grids.create(world)

    fragments.onFragmentsLoaded.add((model) => {
      world.scene.three.add(model)
      console.log('model:', model)
      highlighter.setup({ world })
    })

    const IfcLoader = components.get(OBC.IfcLoader)
    IfcLoader.setup()

    const highlighter = components.get(OBCF.Highlighter)

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
    setupUI()
    setViewer()
    return () => {
      components.dispose()
      fragments.dispose()
    }
  }, [])

  return <bim-viewport id='viewer-container' />
}
