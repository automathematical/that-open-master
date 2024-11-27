import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import TodoForm from './TodoForm'
import TodoCard from './TodoCard'
import { ITodo } from '../classes/Todo'
import React from 'react'
import * as Firestore from 'firebase/firestore'

interface Props {
  todos: ITodo[]
  projectManager: ProjectManager
  todoCollection: Firestore.CollectionReference<ITodo>
}

const ProjectTasksList = ({ todos, projectManager, todoCollection }: Props) => {
  const [selectedTodo, setSelectedTodo] = React.useState<ITodo>()
  const [modalOpen, setModalOpen] = React.useState(false)

  const routeParams = Router.useParams<{ id: string }>()

  if (!routeParams.id) {
    return <p>Invalid project id</p>
  }

  const project = projectManager.getProject(routeParams.id)

  if (!project) {
    return <p>Project with ID {routeParams.id} not found</p>
  }

  const openTodoForm = (todo: ITodo) => {
    setModalOpen(true)
    const modal = document.getElementById('new-todo-modal') as HTMLDialogElement | null
    modal?.showModal()
    setSelectedTodo(todo)
  }

  const todoCards = todos.map(todo => (
    <div
      key={todo.id}
      onClick={() => openTodoForm(todo)}>
      <TodoCard
        key={todo.id}
        todo={todo}
      />
    </div>
  ))

  return (
    <>
      {modalOpen && (
        <TodoForm
          selectedTodo={selectedTodo || undefined}
          todoCollection={todoCollection}
        />
      )}
      <div id='projects-list'>{todos.length > 0 ? todoCards : <p>Nothing todo yet 🥹</p>}</div>
    </>
  )
}

export default ProjectTasksList
