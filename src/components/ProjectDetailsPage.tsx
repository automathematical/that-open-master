import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import { IFCViewer } from './IFCViewer'
import { deleteDocument, updateDocument } from '../firebase'
import { IProject } from '../classes/Project'
import * as BUI from '@thatopen/ui'
import * as OBC from '@thatopen/components'
import { todoTool } from '../bim-components/TodoCreator'

interface Props {
  projectManager: ProjectManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{ id: string }>()
  if (!routeParams.id) {
    return <p>Invalid project id</p>
  }
  const project = props.projectManager.getProject(routeParams.id)
  if (!project) {
    return <p>Project with ID {routeParams.id} not found</p>
  }

  const components = new OBC.Components()
  const todoContainer = React.useRef<HTMLDivElement>(null)

  const navigateTo = Router.useNavigate()
  props.projectManager.onProjectDeleted = async (id) => {
    await deleteDocument('/projects', id)
    navigateTo('/')
  }

  props.projectManager.updateProject = async (project) => {
    await updateDocument<Partial<IProject>>('/projects', project.id, { name: 'new name' })
    // navigateTo(`/project/${project.id}`)
    navigateTo('/')
  }

  React.useEffect(() => {
    const newToDoBtn = document.getElementById('new-todo-btn')
    if (newToDoBtn) {
      newToDoBtn.addEventListener('click', () => {
        console.log('new todooo')
      })
    }
  }, [])

  const onTableCreated = (element?: Element) => {
    if (!element) {
      return
    }
    const toDoTable = element as BUI.Table

    toDoTable.data = [
      {
        data: {
          tasks: 'Make anything here as you want, even something longer.',
          date: 'Fri, 20 sep',
        },
      },
    ]
  }

  React.useEffect(() => {
    const todoButton = todoTool({ components })
    todoContainer.current?.appendChild(todoButton)
  }, [])

  return (
    <div
      className='page'
      id='project-details'>
      <header>
        <div>
          <bim-label
            style={{ color: '#fff', fontSize: 'var(--font-xl)' }}
            data-project-info='name'>
            {project.name}
          </bim-label>
          <bim-label style={{ color: '#969696' }}>{project.description}</bim-label>
        </div>
        <div>
          <bim-button
            label='delete'
            icon='material-symbols:delete'
            onClick={() => props.projectManager.deleteProject(project.id)}></bim-button>
        </div>
      </header>
      <div className='main-page-content'>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 30 }}>
          <div
            className='dashboard-card'
            style={{ padding: '30px 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px 30px',
                marginBottom: 30,
              }}>
              <p
                id='card-icon'
                data-project-info='initials'
                style={{
                  fontSize: 20,
                  backgroundColor: '#ca8134',
                  aspectRatio: 1,
                  borderRadius: '100%',
                  padding: 12,
                  textTransform: 'uppercase',
                }}>
                {project?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </p>
              <div>
                <bim-button
                  style={{ color: 'white' }}
                  label='Edit'
                  icon='material-symbols:edit'
                  onClick={() => props.projectManager.updateProject(project)}></bim-button>
              </div>
            </div>
            <div style={{ padding: '0 30px' }}>
              <div>
                <bim-label
                  style={{ color: '#fff', fontSize: 'var(--font-sm)' }}
                  data-project-info='cardName'>
                  {project?.name}
                </bim-label>
                <bim-label data-project-info='description'>{project?.description}</bim-label>
              </div>
              <div
                style={{
                  display: 'flex',
                  columnGap: 30,
                  padding: '30px 0px',
                  justifyContent: 'space-between',
                }}>
                <div>
                  <bim-label style={{ color: '#fff', fontSize: 'var(--font-sm)' }}>Status</bim-label>
                  <bim-label data-project-info='status'>{project?.status}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: '#fff', fontSize: 'var(--font-sm)' }}>Cost</bim-label>
                  <bim-label data-project-info='cost'>{project?.cost}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: '#fff', fontSize: 'var(--font-sm)' }}>Role</bim-label>
                  <bim-label data-project-info='userRole'>{project?.userRole}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: '#fff', fontSize: 'var(--font-sm)' }}>Finish Date</bim-label>
                  <bim-label data-project-info='finishDate'>date</bim-label>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#404040',
                  borderRadius: 9999,
                  overflow: 'auto',
                }}>
                <div
                  style={{
                    width: `${project?.progress * 100}%`,
                    backgroundColor: 'green',
                    padding: '4px 0',
                    textAlign: 'center',
                  }}>
                  {project?.progress}
                </div>
              </div>
            </div>
          </div>
          <div
            className='dashboard-card'
            style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: '20px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  columnGap: 20,
                }}
                ref={todoContainer}>
                <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
                  <bim-label className='material-icons-round'>search</bim-label>
                  <bim-text-input
                    type='text'
                    placeholder="Search To-Do's by name"
                  />
                </div>
                <bim-button
                  id='new-todo-btn'
                  label='add'
                  icon='material-symbols:add'></bim-button>
              </div>
            </div>

            <div>
              <bim-table
                id='todo-table'
                ref={onTableCreated}></bim-table>
            </div>
          </div>
        </div>
        <IFCViewer components={components} />
      </div>
    </div>
  )
}
