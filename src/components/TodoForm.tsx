import React, { useState, useEffect, useCallback } from 'react'
import * as Firestore from 'firebase/firestore'
import * as Router from 'react-router-dom'
import { ProjectManager } from '../classes/ProjectManager'
import { deleteDocument } from '../firebase'
import { ITodo, Status } from '../classes/Todo'

interface Props {
  selectedTodo?: ITodo
  todoCollection: Firestore.CollectionReference<ITodo>
  projectManager: ProjectManager
  closeModal: () => void
}

const TodoForm = ({ selectedTodo, todoCollection, projectManager, closeModal }: Props) => {
  const initialState: ITodo = {
    id: '',
    name: '',
    description: '',
    status: 'pending',
    finishDate: new Date(),
  }

  const [todo, setTodo] = useState<ITodo>(selectedTodo || initialState)

  // Update form when selectedTodo changes
  useEffect(() => {
    if (selectedTodo) {
      console.log('Selected todo changed:', selectedTodo)
      setTodo(selectedTodo)
    }
  }, [selectedTodo])

  const handleClose = () => {
    setTodo(initialState)
    closeModal()
  }

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
      if (!todoCollection) {
        throw new Error('Todo collection is not initialized')
      }
      if (!selectedTodo) {
        Firestore.addDoc(todoCollection, todoData)
        console.log('Todo created:', todoData)
        todoForm.reset()
        const modal = document.getElementById('new-todo-modal')
        if (!(modal && modal instanceof HTMLDialogElement)) {
          return
        }
        modal.close()
      } else {
        const docRef = Firestore.doc(todoCollection, selectedTodo.id)
        Firestore.updateDoc(docRef, { ...todo })
        console.log('Todo updated:', todo)
        todoForm.reset()
        const modal = document.getElementById('new-todo-modal')
        if (!(modal && modal instanceof HTMLDialogElement)) {
          return
        }
        modal.close()
      }
    } catch (error) {
      alert(error)
    }
  }

  const navigateTo = Router.useNavigate()

  projectManager.onProjectDeleted = async id => {
    await deleteDocument('/' + todoCollection.path, id)
    navigateTo('/')
  }

  return (
    <>
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
              required
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
              placeholder='Give your project a nice description!'
              onChange={handleInput}
              required
            />
          </div>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'></span>Status
            </label>
            <select
              name='status'
              value={todo.status}
              onChange={handleInput}>
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
              value={todo.finishDate.toISOString().split('T')[0]}
              onChange={handleInput}
              required
            />
          </div>
          <div style={{ display: 'flex', margin: '10px 0px 10px auto', columnGap: '10px' }}>
            <button
              type='button'
              onClick={handleClose}
              id='cancel-btn-todo-new'
              style={{ backgroundColor: 'transparent' }}>
              Cancel
            </button>
            <button
              type='submit'
              style={{ backgroundColor: 'rgb(18, 145, 18)' }}>
              {selectedTodo ? 'Update' : 'Create'}
            </button>
            {selectedTodo ? (
              <button
                type='button'
                onClick={() => projectManager.onProjectDeleted(todo.id)}
                id='delete-btn-todo'
                style={{ backgroundColor: 'rgb(255, 0, 0)' }}>
                Delete
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </form>
    </>
  )
}

export default TodoForm
