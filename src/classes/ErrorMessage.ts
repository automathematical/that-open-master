export class ErrorMessage {
    title: string
    msg: string
    ui: HTMLDialogElement
    parent: HTMLElement
    error: Error

    constructor(container: HTMLElement, error: Error) {
        this.error = error
        this.title = error.name
        this.msg = error.message
        this.parent = container
    }

    showError() {
        this.ui = document.createElement('dialog')
        console.log(this.ui);
        this.ui.className = 'error-dialog'
        this.ui.id = 'error-dialog'
        this.ui.innerHTML = `
        <div id="error-container">
            <h4>${this.title}</h4>
            <p>${this.msg}</p>
            <div id='error-ok'>
                <button class='ok-btn' id='ok-btn'>Ok</button>
            </div>
        </div>
        `
        this.parent.append(this.ui)
        this.ui.showModal()
        const closeButton = document.getElementById("ok-btn")
        closeButton?.addEventListener('click', () => {
            this.ui.close()
            this.ui.remove()
        })
    }
}