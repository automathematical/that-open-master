const showModal = (id) => {
  const modal = document.getElementById(id)
  modal.showModal()
}

// this is the document ..
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    showModal('new-project-modal')
  })
} else {
  console.log('New Projects button was not found')
}

const projectForm = document.getElementById('new-project-form')
if (projectForm) {
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const project = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
      role: formData.get('role'),
      finishDate: formData.get('finishDate'),
    }
    console.log(project)
  })
} else {
  console.log('The Project form was not found')
}
