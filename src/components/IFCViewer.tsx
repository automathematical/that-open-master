import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as THREE from 'three'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import { FragmentsGroup } from '@thatopen/fragments'

export function IFCViewer() {
  const components = new OBC.Components()
  let fragmentModel: FragmentsGroup | undefined
  const [classificationsTree, updateClassificationsTree] = CUI.tables.classificationTree({
    components,
    classifications: [],
  })

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

    const fragments = components.get(OBC.FragmentsManager)
    fragments.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model)

      const indexer = components.get(OBC.IfcRelationsIndexer)
      await indexer.process(model)

      const classifier = components.get(OBC.Classifier)
      await classifier.byPredefinedType(model)
      classifier.byEntity(model)

      const classifications = [
        { system: 'entities', label: 'Entities' },
        { system: 'predefinedTypes', label: 'predefined Types' },
      ]

      if (updateClassificationsTree) {
        updateClassificationsTree({ classifications })
      }

      fragmentModel = model
    })

    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup({ world })
    highlighter.zoomToSelection = true

    const IfcLoader = components.get(OBC.IfcLoader)
    IfcLoader.setup()

    viewerContainer.addEventListener('resize', () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })
  }

  const onToggleVisibility = (e: CustomEvent) => {
    const highlighter = components.get(OBCF.Highlighter)
    const fragments = components.get(OBC.FragmentsManager)
    const selection = highlighter.selection.select
    if (Object.keys(selection).length === 0) return
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID)
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        if (!fragment) return
        const isHidden = fragment.hiddenItems.has(id)
        if (isHidden) {
          fragment.setVisibility(true, [id])
        } else {
          fragment.setVisibility(false, [id])
        }
      }
    }
  }

  const onIsolate = (e: CustomEvent) => {
    const highlighter = components.get(OBCF.Highlighter)
    const hider = components.get(OBC.Hider)
    const selection = highlighter.selection.select
    hider.isolate(selection)
  }

  const onShowAll = (e: CustomEvent) => {
    const hider = components.get(OBC.Hider)
    hider.set(true)
  }

  const onShowProperties = async (e: CustomEvent) => {
    if (!fragmentModel) return
    const highlighter = components.get(OBCF.Highlighter)
    const fragments = components.get(OBC.FragmentsManager)
    const indexer = components.get(OBC.IfcRelationsIndexer)
    const selection = highlighter.selection.select
    if (Object.keys(selection).length === 0) return
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID)
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        const psets = indexer.getEntityRelations(fragmentModel, id, 'IsDefinedBy')

        if (!psets) return
        for (const expressIDs of psets) {
          const prop = await fragmentModel.getProperties(expressIDs)
          console.log(prop)
        }
      }
    }
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

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({ components, fragmentIdMap: {} })
      const highlighter = components.get(OBCF.Highlighter)

      if (highlighter.isSetup) {
        highlighter.events.select.onHighlight.add((fragmentIdMap) => {
          if (!floatingGrid) return
          floatingGrid.layout = 'second'
          updatePropsTable({ fragmentIdMap })
          propsTable.expanded = false
        })

        highlighter.events.select.onClear.add(() => {
          updatePropsTable({ fragmentIdMap: {} })
          if (!floatingGrid) return
          floatingGrid.layout = 'main'
        })
      }

      const search = (e: CustomEvent) => {
        const input = e.target as BUI.TextInput
        propsTable.queryString = input.value
      }

      return BUI.html`
      <bim-panel>
      <bim-panel-section name="World" label="World" icon="solar:document-bold" fixed>
      <bim-text-input @input=${search} placeholder="Search" icon="mdi:magnify"></bim-text-input>
      ${propsTable}
      </bim-panel-section>
       </bim-panel>
    `
    })

    const onClassifier = (e: CustomEvent) => {
      if (!floatingGrid) return
      if (floatingGrid.layout !== 'classifier') {
        floatingGrid.layout = 'classifier'
      } else {
        floatingGrid.layout = 'main'
      }
    }

    const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
      <bim-panel label="Classification Tree">
      <bim-panel-section name="classifier" label="Classifications" icon="solar:document-bold" fixed>
      <bim-label>Classifications</bim-label>
      ${classificationsTree}
      </bim-panel-section>
       </bim-panel>
    `
    })

    const onWorldsUpdate = (e: CustomEvent) => {
      if (!floatingGrid) return
      floatingGrid.layout = 'world'
    }

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldTable] = CUI.tables.worldsConfiguration({ components })

      const search = (e: CustomEvent) => {
        const input = e.target as BUI.TextInput
        worldTable.queryString = input.value
      }
      return BUI.html`
      <bim-panel>
      <bim-panel-section name="Property" label="Property Information" icon="solar:document-bold" fixed>
      <bim-text-input @input=${search} placeholder="Search" icon="mdi:magnify"></bim-text-input>
      ${worldTable}
      </bim-panel-section>
       </bim-panel>
    `
    })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components })
      return BUI.html`
        <bim-toolbar style="justify-self: center">
        <bim-toolbar-section label="App">
        <bim-button icon="tabler:brush" label="World" @click=${onWorldsUpdate}></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Import">
        ${loadIfcBtn}
        </bim-toolbar-section>
        <bim-toolbar-section label="Selection">
        <bim-button icon="material-symbols:visibility-outline" label="Visibility" @click=${onToggleVisibility}></bim-button>
        <bim-button icon="mdi:filter" label="Isolate" @click=${onIsolate}></bim-button> 
        <bim-button icon="tabler:eye-filled" label="Show All" @click=${onShowAll}></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Properties">
        <bim-button icon="clarity:list-line" label="Show" @click=${onShowProperties}></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Groups">
        <bim-button icon="tabler:eye-filled" label="Classifier" @click=${onClassifier}></bim-button>
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
      second: {
        template: `
          "empty elementPropertyPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
     `,
        elements: {
          toolbar,
          elementPropertyPanel,
        },
      },
      world: {
        template: `
          "empty worldPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
     `,
        elements: {
          toolbar,
          worldPanel,
        },
      },
      classifier: {
        template: `
          "empty classifierPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
     `,
        elements: {
          toolbar,
          classifierPanel,
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
      if (components) components.dispose()
      if (fragmentModel) {
        fragmentModel.dispose()
        fragmentModel = undefined
      }
    }
  }, [])

  return <bim-viewport id='viewer-container' />
}
