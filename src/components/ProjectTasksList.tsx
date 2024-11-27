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
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ProjectTasksList = ({ todos, projectManager, todoCollection, modalOpen, openModal, closeModal }: Props) => {
  const [selectedTodo, setSelectedTodo] = React.useState<ITodo>()

  const openTodoForm = (todo: ITodo) => {
    console.log('Opening selected todo form:', todo)
    setSelectedTodo(todo)
    openModal()
  }

  React.useEffect(() => {
    if (!modalOpen) setSelectedTodo(undefined)
  }, [modalOpen])

  const todoCards = todos.map(todo => (
    <div
      key={todo.id}
      onClick={() => openTodoForm(todo)}>
      <TodoCard todo={todo} />
    </div>
  ))

  console.log('form open and mounted? ', modalOpen, selectedTodo)

  return (
    <>
      <dialog
        id='new-todo-modal'
        onClose={closeModal}>
        {modalOpen && (
          <TodoForm
            selectedTodo={selectedTodo}
            todoCollection={todoCollection}
            projectManager={projectManager}
            closeModal={closeModal}
          />
        )}
      </dialog>
      <div id='projects-list'>{todos.length > 0 ? todoCards : <p>Nothing todo yet 🥹</p>}</div>
    </>
  )
}

export default ProjectTasksList
