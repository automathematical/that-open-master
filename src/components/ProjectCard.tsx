import React from 'react'
import { Project } from '../class/Project'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <div id='project-card'>
      <div className='card-header'>
        <p
          style={{
            backgroundColor: '#ca8134',
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1,
            textTransform: 'uppercase',
          }}>
          {project.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </p>
        <div>
          <h5>{project.name}</h5>
          <p>{project.description}</p>
        </div>
      </div>
      <div className='card-content'>
        <div className='card-property'>
          <p style={{ color: '#969696' }}>Status</p>
          <p>{project.status}</p>
        </div>
        <div className='card-property'>
          <p style={{ color: '#969696' }}>Cost</p>
          <p>{project.cost}</p>
        </div>
        <div className='card-property'>
          <p style={{ color: '#969696' }}>Role</p>
          <p>{project.userRole}</p>
        </div>
        <div className='card-property'>
          <p style={{ color: '#969696' }}>Estimated Progress</p>
          <p>{project.progress}</p>
        </div>
      </div>
      `
    </div>
  )
}
