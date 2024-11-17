import React from 'react'

const TodoCard = () => {
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
          <p>Make anything here as you want, even something longer.</p>
        </div>
        <p style={{ textWrap: 'nowrap', marginLeft: 10 }}>Fri, 20 sep</p>
      </div>
    </div>
  )
}

export default TodoCard
