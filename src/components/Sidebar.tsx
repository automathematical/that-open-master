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
        <Router.Link to={'/'}>
          <li id='projects-navbtn'>
            <bim-label
              style={{ color: '#fff' }}
              icon='material-symbols:apartment'>
              Projects
            </bim-label>
          </li>
        </Router.Link>
        <Router.Link to={'/users'}>
          <li id='users-navbtn'>
            <bim-label
              style={{ color: '#fff' }}
              icon='mdi:user'>
              Users
            </bim-label>
          </li>
        </Router.Link>
      </ul>
    </aside>
  )
}
