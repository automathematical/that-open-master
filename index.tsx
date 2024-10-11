import * as OBC from 'openbim-components'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import * as Router from 'react-router-dom'
import { Sidebar } from './src/components/Sidebar'
import { ProjectsPage } from './src/components/ProjectsPage'
import { ProjectDetailsPage } from './src/components/ProjectDetailsPage'
import { UsersPage } from './src/components/UsersPage'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FragmentsGroup } from 'bim-fragment'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { ErrorMessage } from './src/classes/ErrorMessage'
import { IProject, UserRole, ProjectStatus } from './src/classes/Project'
import { ProjectManager } from './src/classes/ProjectManager'
import * as BUI from '@thatopen/ui'

BUI.Manager.init()

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bim-grid': any
      'bim-label': any
      'bim-button': any
      'bim-text-input': any
      'bim-table': any
      'bim-dropdown': any
      'bim-option': any
    }
  }
}

const projectManager = new ProjectManager()

const rootElement = document.getElementById('app') as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
    <Router.BrowserRouter>
      <Sidebar />
      <Router.Routes>
        <Router.Route
          path='/'
          element={<ProjectsPage projectManager={projectManager} />}
        />
        <Router.Route
          path='/project/:id'
          element={<ProjectDetailsPage projectManager={projectManager} />}
        />
        <Router.Route
          path='/users'
          element={<UsersPage />}
        />
      </Router.Routes>
    </Router.BrowserRouter>
  </>
)

const newToDoBtn = document.getElementById('new-todo-btn')
if (newToDoBtn) {
  newToDoBtn.addEventListener('click', () => {
    console.log('new todooo')
  })
}
