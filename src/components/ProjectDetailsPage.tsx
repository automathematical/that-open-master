import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import { ThreeViewer } from './ThreeViewer'
import { deleteDocument } from '../firebase'
import ProjectTasksList from './ProjectTasksList'
import { getSubCollection } from '../firebase'
import { ITodo } from '../classes/Todo'
import * as Firestore from 'firebase/firestore'
import SearchBox from './SearchBox'

interface Props {
  projectManager: ProjectManager
}

export function ProjectDetailsPage(props: Props) {
  const [todos, setTodos] = React.useState<ITodo[]>([])

  const [modalOpen, setModalOpen] = React.useState(false)
  const closeModal = () => setModalOpen(false)
  const openModal = () => setModalOpen(true)

  if (modalOpen) {
    const modal = document.getElementById('new-todo-modal') as HTMLDialogElement | null
    modal?.showModal()
  } else {
    const modal = document.getElementById('new-todo-modal') as HTMLDialogElement | null
    modal?.close()
  }

  const routeParams = Router.useParams<{ id: string }>()
  if (!routeParams.id) {
    return <p>Invalid project id</p>
  }
  const project = props.projectManager.getProject(routeParams.id)
  if (!project) {
    return <p>Project with ID {routeParams.id} not found</p>
  }

  const todoCollection = getSubCollection<ITodo>('/projects/' + project.id, 'todoList')

  const getFirebaseTodos = async () => {
    const firebaseTodos = await Firestore.getDocs(todoCollection)
    const newTodos: ITodo[] = []

    for (const doc of firebaseTodos.docs) {
      const data = doc.data()

      const todo: ITodo = {
        ...data,
        id: doc.id,
        finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate(),
      }
      newTodos.push(todo)
    }
    setTodos(newTodos)
  }

  React.useEffect(() => {
    getFirebaseTodos()
  }, [])

  const navigateTo = Router.useNavigate()

  props.projectManager.onProjectDeleted = async id => {
    await deleteDocument('/projects', id)
    navigateTo('/')
  }

  const onTodoSearch = (value: string) => {
    const list = todos
    if (value === '' || value === undefined || value === null) {
      getFirebaseTodos()
      setTodos(list)
    } else {
      const filteredTodos = list.filter(item => {
        return item.name.includes(value)
      })
      setTodos(filteredTodos)
    }
  }

  return (
    <div
      className='page'
      id='project-details'>
      <header>
        <div>
          <h2 data-project-info='name'>{project.name}</h2>
          <p style={{ color: '#969696' }}>{project.description}</p>
        </div>
        <button
          onClick={() => props.projectManager.deleteProject(project.id)}
          style={{ backgroundColor: 'red' }}>
          Delete project
        </button>
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
              <button
                onClick={() => props.projectManager.updateProject(project)}
                id='edit-project-btn'
                className='btn-secondary'>
                <p style={{ width: '100%' }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: '0 30px' }}>
              <div>
                <h5 data-project-info='cardName'>{project?.name}</h5>
                <p data-project-info='description'>{project?.description}</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  columnGap: 30,
                  padding: '30px 0px',
                  justifyContent: 'space-between',
                }}>
                <div>
                  <p style={{ color: '#969696', fontSize: 'var(--font-sm)' }}>Status</p>
                  <p data-project-info='status'>{project?.status}</p>
                </div>
                <div>
                  <p style={{ color: '#969696', fontSize: 'var(--font-sm)' }}>Cost</p>
                  <p data-project-info='cost'>{project?.cost}</p>
                </div>
                <div>
                  <p style={{ color: '#969696', fontSize: 'var(--font-sm)' }}>Role</p>
                  <p data-project-info='userRole'>{project?.userRole}</p>
                </div>
                <div>
                  <p style={{ color: '#969696', fontSize: 'var(--font-sm)' }}>Finish Date</p>
                  <p data-project-info='finishDate'>{project?.finishDate.toLocaleDateString()}</p>
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
              <h4>To-Do</h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  columnGap: 20,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
                  <span className='material-icons-round'>search</span>
                  <SearchBox onChange={value => onTodoSearch(value)} />
                </div>

                <button onClick={openModal}>
                  <span
                    id='new-todo-btn'
                    className='material-icons-round'>
                    add
                  </span>
                </button>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 30px',
                rowGap: 20,
              }}>
              <ProjectTasksList
                projectManager={props.projectManager}
                todos={todos}
                todoCollection={todoCollection}
                modalOpen={modalOpen}
                openModal={openModal}
                closeModal={closeModal}
              />
            </div>
          </div>
        </div>
        <ThreeViewer />
      </div>
    </div>
  )
}
