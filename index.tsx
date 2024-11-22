import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import * as Router from 'react-router-dom'
import { Sidebar } from './src/components/Sidebar'
import { ProjectsPage } from './src/components/ProjectsPage'
import { ProjectDetailsPage } from './src/components/ProjectDetailsPage'
import { ProjectManager } from './src/classes/ProjectManager'

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
      </Router.Routes>
    </Router.BrowserRouter>
  </>
)
