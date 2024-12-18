import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as THREE from 'three'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import { FragmentsGroup } from '@thatopen/fragments'
import { TodoCreator } from '../bim-components/TodoCreator'
import { SimpleQTO } from '../bim-components/SimpleQTO'

interface Props {
  components: OBC.Components
}

export function IFCViewer(Props: Props) {
  const components = Props.components
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

    const fragmentManager = components.get(OBC.FragmentsManager)
    fragmentManager.onFragmentsLoaded.add(async model => {
      world.scene.three.add(model)

      model.getLocalProperties()
      if (model.hasProperties) {
        await processModel(model)
      }

      for (const fragment of model.items) {
        culler.add(fragment.mesh)
      }

      culler.needsUpdate = true

      fragmentModel = model
    })

    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup({ world })
    highlighter.zoomToSelection = true

    const IfcLoader = components.get(OBC.IfcLoader)
    IfcLoader.setup()

    const cullers = components.get(OBC.Cullers)
    const culler = cullers.create(world)

    viewerContainer.addEventListener('resize', () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })

    world.camera.controls.addEventListener('controlend', () => {
      culler.needsUpdate = true
    })

    const todoCreator = components.get(TodoCreator)
    todoCreator.world = world
    todoCreator.setup()
  }

  const processModel = async (model: FragmentsGroup) => {
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
  }

  const OnFragmentExport = () => {
    const fragmentsManager = components.get(OBC.FragmentsManager)

    if (!fragmentModel) return
    const fragmentBinary = fragmentsManager.export(fragmentModel)
    const blob = new Blob([fragmentBinary])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fragmentModel.name}.frag`
    a.click()
    URL.revokeObjectURL(url)
  }
  const OnPropertyExport = (FileName: string = 'properties') => {
    if (!fragmentModel) return
    const properties = fragmentModel.getLocalProperties()
    const json = JSON.stringify(properties, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = FileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const onPropertyImport = async (e: CustomEvent) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const json = reader.result
      if (!json) {
        return
      }
      //! At the moment just logging the imported json props
      console.log(json)
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) {
        return
      }
      reader.readAsText(filesList[0])
    })
    input.click()
  }

  const onFragmentImport = async (e: CustomEvent) => {
    const fragmentsManager = components.get(OBC.FragmentsManager)

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.frag'
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const binary = reader.result
      if (!(binary instanceof ArrayBuffer)) {
        return
      }
      const fragmentBinary = new Uint8Array(binary)
      fragmentsManager.load(fragmentBinary)
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) {
        return
      }
      reader.readAsArrayBuffer(filesList[0])
    })
    input.click()
  }

  const onFragmentDispose = (e: CustomEvent) => {
    console.log('dispose')
    const fragmentsManager = components.get(OBC.FragmentsManager)
    if (!fragmentModel) return
    for (const [, group] of fragmentsManager.groups) {
      fragmentsManager.disposeGroup(group)
    }
    fragmentModel = undefined
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
        highlighter.events.select.onHighlight.add(async fragmentIdMap => {
          if (!floatingGrid) return
          floatingGrid.layout = 'second'
          updatePropsTable({ fragmentIdMap })
          propsTable.expanded = false

          const simpleQTO = components.get(SimpleQTO)
          await simpleQTO.sumQuantities(fragmentIdMap)
          await simpleQTO.sumQuantitiesV2(fragmentIdMap)
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
      loadIfcBtn.tooltipTitle = 'Load IFC'
      loadIfcBtn.label = ''
      return BUI.html`
        <bim-toolbar style="justify-self: center">
        <bim-toolbar-section label="App">
        <bim-button icon="tabler:brush" tooltip-title="World" @click=${onWorldsUpdate}></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Import">
          ${loadIfcBtn}
        </bim-toolbar-section>

        <bim-toolbar-section label="Fragments">
        <bim-button tooltip-title='Import' icon='mdi:cube' @click=${onFragmentImport} ></bim-button>
        <bim-button tooltip-title='Export' icon='tabler:package-export' @click=${OnFragmentExport} ></bim-button>
        <bim-button tooltip-title='Dispose' icon='tabler:trash' @click=${onFragmentDispose} ></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Selection">
        <bim-button icon="material-symbols:visibility-outline" tooltip-title="Visibility" @click=${onToggleVisibility}></bim-button>
        <bim-button icon="mdi:filter" tooltip-title="Isolate" @click=${onIsolate}></bim-button>
        <bim-button icon="tabler:eye-filled" tooltip-title="Show All" @click=${onShowAll}></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Properties">
        <bim-button icon="clarity:list-line" tooltip-title="Show" @click=${onShowProperties}></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Properties">
        <bim-button tooltip-title='Import' icon='mdi:cube' @click=${onPropertyImport} ></bim-button>
        <bim-button tooltip-title='Export' icon='tabler:package-export' @click=${OnPropertyExport} ></bim-button>
        </bim-toolbar-section>

        <bim-toolbar-section label="Groups">
        <bim-button icon="tabler:eye-filled" tooltip-title="Classifier" @click=${onClassifier}></bim-button>
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
    setTimeout(() => {
      setViewer()
      setupUI()
    })
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
