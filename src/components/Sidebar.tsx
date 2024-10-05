import * as React from 'react'
import * as Router from 'react-router-dom'

export function Sidebar() {
  return (
    <aside id='sidebar'>
      <Router.Link to={'/'}>
        <img
          id='company-logo'
          src='./assets/company-logo.svg'
          alt='Construction Company'
        />
      </Router.Link>
      <ul id='nav-buttons'>
        <Router.Link to={'/project'}>
          <li id='projects-navbtn'>
            <span className='material-icons-round'>apartment</span>Projects
          </li>
        </Router.Link>
        <Router.Link to={'/user'}>
          <li id='users-navbtn'>
            <span className='material-icons-round'>people</span>Users
          </li>
        </Router.Link>
      </ul>
    </aside>
  )
}
