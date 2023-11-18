const showModal = () => {
  const modal = document.getElementById('new-project-modal')
  modal.showModal()
}

//
const newProjectBtn = document.getElementById('new-project-btn')
newProjectBtn.addEventListener('click', showModal)
