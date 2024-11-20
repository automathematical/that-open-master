import React from 'react'
import { Todo } from '../classes/Todo'

interface Props {
  todo: Todo
}

const TodoCard = ({ todo }: Props) => {
  const { name, description, status, finishDate } = todo

  let color = ''
  switch (status) {
    case 'active':
      color = '#ff0000' //red
      break
    case 'pending':
      color = '#ffff00' //yellow
      break
    case 'finished':
      color = '#008000' //green
      break
    default:
      console.warn('Unknown status:', status)
  }

  return (
    <div className='todo-item'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div style={{ display: 'flex', columnGap: 15, alignItems: 'center' }}>
          <span
            className='material-icons-round'
            style={{
              padding: 10,
              backgroundColor: '#686868',
              borderRadius: 10,
            }}>
            construction
          </span>
          <p>{name}</p>
          {/* <p>{description}</p> */}
          <p style={{ backgroundColor: color }}>{status}</p>
        </div>
        <p style={{ textWrap: 'nowrap', marginLeft: 10 }}>{finishDate.toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default TodoCard
