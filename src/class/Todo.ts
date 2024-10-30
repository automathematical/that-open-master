import { v4 as uuidv4 } from 'uuid'

export type Status = "pending" | "active" | "finished"

export interface ITodo {
    name: string
    description: string
    status: Status
    finishDate: Date
    id: string
}

export class Todo implements ITodo {
    //To satisfy IProject
    name: string
    description: string
    status: Status
    finishDate: Date

    //Class internals
    ui: HTMLDivElement
    id: string

    constructor(data: ITodo) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = uuidv4()
        this.setUI()
    }

    //render data
    setUI() {
        if (this.ui && this.ui instanceof HTMLElement) { return }
        this.ui = document.createElement("div")
        this.ui.className = 'project-todo'
        this.ui.id = this.id //set id to the ui id
        this.ui.innerHTML = `
    <div class="todo">
        <div>
            <h5>${this.name}</h5>
            <p>${this.description}</p>
            <p>${this.status}</p>
        </div>
</div>`}
}
