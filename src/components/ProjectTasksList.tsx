import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import TodoForm from './TodoForm'
import TodoCard from './TodoCard'
import { ITodo, Todo } from '../classes/Todo'
import React from 'react'

interface Props {
  todos: Todo[]
  projectManager: ProjectManager
  todoCollection: any
}

const ProjectTasksList = ({ todos, projectManager, todoCollection }: Props) => {
  const [selectedTodo, setSelectedTodo] = React.useState<Todo | null>(null)

  const routeParams = Router.useParams<{ id: string }>()

  if (!routeParams.id) {
    return <p>Invalid project id</p>
  }

  const project = projectManager.getProject(routeParams.id)

  if (!project) {
    return <p>Project with ID {routeParams.id} not found</p>
  }

  const openTodoForm = (todo: Todo) => {
    setSelectedTodo(todo)
    const modal = document.getElementById('new-todo-modal') as HTMLDialogElement | null
    modal?.showModal()
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
      <TodoForm
        projectManager={projectManager}
        selectedTodo={selectedTodo || undefined}
        todoCollection={todoCollection}
      />
      <div id='projects-list'>{todos.length > 0 ? todoCards : <p>Nothing todo yet 🥹</p>}</div>
    </>
  )
}

export default ProjectTasksList
