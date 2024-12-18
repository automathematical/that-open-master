import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import { IFCViewer } from './IFCViewer'
import { deleteDocument, updateDocument } from '../firebase'
import { IProject } from '../classes/Project'
import * as BUI from '@thatopen/ui'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import { TodoCreator, todoTool } from '../bim-components/TodoCreator'
import { TodoData } from '../bim-components/TodoCreator/src/base-types'

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
  const dashboard = React.useRef<HTMLDivElement>(null)
  const todoContainer = React.useRef<HTMLDivElement>(null)

  const navigateTo = Router.useNavigate()
  props.projectManager.onProjectDeleted = async id => {
    await deleteDocument('/projects', id)
    navigateTo('/')
  }

  props.projectManager.updateProject = async project => {
    await updateDocument<Partial<IProject>>('/projects', project.id, { name: 'new name' })
    // navigateTo(`/project/${project.id}`)
    navigateTo('/')
  }

  const onRowCreated = (e: CustomEvent) => {
    e?.stopImmediatePropagation()
    const { row } = e.detail
    row.addEventListener('click', () => {
      todoCreator.highLightTodo({
        name: row.data.Name,
        task: row.data.Task,
        priority: row.data.priority,
        ifcGuids: JSON.parse(row.data.Guids),
        camera: JSON.parse(row.data.Camera),
        actions: '',
      })
    })
  }

  const todoTable = BUI.Component.create<BUI.Table>(() => {
    return BUI.html`
    <bim-table @rowcreated=${onRowCreated}></bim-table>
    `
  })

  const addTodo = (data: TodoData) => {
    if (!todoTable) return
    const newData = {
      data: {
        Name: data.name,
        Task: data.task,
        Date: new Date().toDateString(),
        prority: data.priority,
        Guids: JSON.stringify(data.ifcGuids),
        Camera: data.camera ? JSON.stringify(data.camera) : '',
        actions: '',
      },
    }
    todoTable.data = [...todoTable.data, newData]
    todoTable.dataTransform = {
      actions: () => {
        return BUI.html`
        <div>
          <bim-button icon="material-symbols:delete" style='background-color: red' @click=${() => {}}> </bim-button>
        </div>
        `
      },
    }
    todoTable.hiddenColumns = ['Guids', 'Camera']
  }

  const todoCreator = components.get(TodoCreator)
  todoCreator.onTodoCreated.add(data => addTodo(data))

  React.useEffect(() => {
    dashboard.current?.appendChild(todoTable)
    const [todoButton, todoPriorityButton] = todoTool({ components })
    todoContainer.current?.appendChild(todoButton)
    todoContainer.current?.appendChild(todoPriorityButton)

    todoCreator.onDisposed.add(() => {
      todoTable.data = []
      todoTable.remove()
      todoButton.remove()
      todoPriorityButton.remove()
    })
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
                  .map(n => n[0])
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
            style={{ flexGrow: 1 }}
            ref={dashboard}>
            <div
              style={{
                padding: '20px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <bim-label style={{ color: '#fff', fontSize: 'var(--font-lg)' }}>To-Do</bim-label>
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
              </div>
            </div>
          </div>
        </div>
        <IFCViewer components={components} />
      </div>
    </div>
  )
}
