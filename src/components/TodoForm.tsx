import React, { useState } from 'react'
import * as Firestore from 'firebase/firestore'

import { ITodo, Status, Todo } from '../classes/Todo'
import { ProjectManager } from '../classes/ProjectManager'

interface Props {
  projectManager: ProjectManager
  selectedTodo?: Todo
  todoCollection?: any
}

const TodoForm = ({ projectManager, selectedTodo, todoCollection }: Props) => {
  console.log('selectedTodo:', selectedTodo)

  const [todo, setTodo] = useState<Todo>({
    id: '',
    name: '',
    description: '',
    status: 'pending',
    finishDate: new Date(),
  })
  const onCancelClick = () => {
    const modal = document.getElementById('new-todo-modal') as HTMLDialogElement | null
    modal?.close()
  }

  // Update form when selectedTodo changes
  React.useEffect(() => {
    if (selectedTodo) {
      setTodo(selectedTodo)
    }
  }, [selectedTodo])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setTodo(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const todoForm = document.getElementById('new-todo-form')
    if (!(todoForm && todoForm instanceof HTMLFormElement)) {
      return
    }

    const formData = new FormData(todoForm)
    const todoData: ITodo = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      status: formData.get('status') as Status,
      description: formData.get('description') as string,
      finishDate: new Date(formData.get('finishDate') as string),
    }

    try {
      Firestore.addDoc(todoCollection, todoData)
      console.log('Todo created:', todoData)
      todoForm.reset()
      const modal = document.getElementById('new-todo-modal')
      if (!(modal && modal instanceof HTMLDialogElement)) {
        return
      }
      modal.close()
    } catch (error) {
      alert(error)
    }
  }

  console.log('todo:', todo)

  return (
    <dialog id='new-todo-modal'>
      <form
        id='new-todo-form'
        onSubmit={onFormSubmit}>
        <div className='input-list'>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'>construction</span>Name
            </label>
            <input
              name='name'
              value={todo.name}
              type='text'
              placeholder="What's the name of your project?"
              onChange={handleInput}
            />
            <p style={{ color: 'gray', fontSize: 'var(--font-sm)', marginTop: '5px', fontStyle: 'italic' }}>TIP: Give it a short name</p>
            <p id='error'></p>
          </div>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'>subject</span>Description
            </label>
            <textarea
              name='description'
              value={todo.description}
              cols={30}
              rows={5}
              onChange={handleInput}
              placeholder='Give your project a nice description!'
            />
          </div>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'></span>Status
            </label>
            <select
              name='status'
              onChange={handleInput}
              value={todo.status}>
              <option value='pending'>pending</option>
              <option value='active'>active</option>
              <option value='finished'>finished</option>
            </select>
          </div>
          <div className='form-field-container'>
            <label htmlFor='finishDate'>
              <span className='material-icons-round'>calendar_month</span>
              Finish Date
            </label>
            <input
              name='finishDate'
              type='date'
            />
          </div>
          <div style={{ display: 'flex', margin: '10px 0px 10px auto', columnGap: '10px' }}>
            <button
              type='button'
              value='cancel'
              onClick={onCancelClick}
              id='cancel-btn-todo-new'
              style={{ backgroundColor: 'transparent' }}>
              Cancel
            </button>
            <button
              type='submit'
              style={{ backgroundColor: 'rgb(18, 145, 18)' }}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}

export default TodoForm
