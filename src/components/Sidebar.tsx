import * as React from 'react'

export function Sidebar() {
  return (
    <aside id='sidebar'>
      <img
        id='company-logo'
        src='./assets/company-logo.svg'
        alt='Construction Company'
      />
      <ul id='nav-buttons'>
        <li id='projects-navbtn'>
          <span className='material-icons-round'>apartment</span>Projects
        </li>
        <li id='users-navbtn'>
          <span className='material-icons-round'>people</span>Users
        </li>
      </ul>
    </aside>
  )
}
