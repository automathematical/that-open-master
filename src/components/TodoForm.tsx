import React from 'react'
import { ITodo, Status } from '../classes/Todo'
import { ProjectManager } from '../classes/ProjectManager'
import { getCollection } from '../firebase'
import { IProject } from '../classes/Project'

interface Props {
  projectManager: ProjectManager
}

const projectCollection = getCollection<IProject>('/projects')

const TodoForm = (props: Props) => {
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const todoForm = document.getElementById('new-todo-form')
    if (!(todoForm && todoForm instanceof HTMLFormElement)) {
      return
    }

    const formData = new FormData(todoForm)
    const todoData: ITodo = {
      name: formData.get('name') as string,
      status: formData.get('status') as Status,
      description: formData.get('description') as string,
      finishDate: new Date(formData.get('finishDate') as string),
    }

    try {
      // Firestore.addDoc(projectCollection, todoData)
      // const todo = props.todoManager.newTodo(todoData)
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

  const onCancelClick = () => {
    const modal = document.getElementById('new-todo-modal')
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    }
  }

  return (
    <dialog id='new-todo-modal'>
      <form
        id='new-todo-form'
        onSubmit={onFormSubmit}>
        <h2>New Todo</h2>
        <div className='input-list'>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'>todo</span>Name
            </label>
            <input
              name='name'
              type='text'
              placeholder="What's the name of your project?"
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
              cols={30}
              rows={5}
              placeholder='Give your project a nice description!'></textarea>
          </div>
          <div className='form-field-container'>
            <label>
              <span className='material-icons-round'>status</span>Status
            </label>
            <select name='status'>
              <option>Pending</option>
              <option>Active</option>
              <option>Finished</option>
            </select>
          </div>
          <div className='form-field-container'>
            <label htmlFor='finishDate'>
              <span className='material-icons-round'>calendar_month</span>
              Finish Date
            </label>
            <input
              name='finishDate'
              type='date'></input>
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
              Accept
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}

export default TodoForm
