import React from 'react'
import { Project } from '../classes/Project'

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
            .map(n => n[0])
            .join('')}
        </p>
        <div>
          <bim-label style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>{project.name}</bim-label>
          <bim-label style={{ color: '#fff' }}>{project.description}</bim-label>
        </div>
      </div>
      <div className='card-content'>
        <div className='card-property'>
          <bim-label>Status</bim-label>
          <bim-label style={{ color: '#fff' }}>{project.status}</bim-label>
        </div>
        <div className='card-property'>
          <bim-label>Cost</bim-label>
          <bim-label style={{ color: '#fff' }}>{project.cost}</bim-label>
        </div>
        <div className='card-property'>
          <bim-label>Role</bim-label>
          <bim-label style={{ color: '#fff' }}>{project.userRole}</bim-label>
        </div>
        <div className='card-property'>
          <bim-label>Estimated Progress</bim-label>
          <bim-label style={{ color: '#fff' }}>{project.progress}</bim-label>
        </div>
      </div>
      `
    </div>
  )
}
