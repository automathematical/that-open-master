import { v4 as uuidv4 } from 'uuid'
import { Todo } from './Todo'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    id: string
    todoList: Todo[]
}

export class Project implements IProject {
    //To satisfy IProject
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    todoList: Todo[]

    //Class internals
    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject,) {

        for (const key in data) {
            this[key] = data[key]
        }
        if (this.id === null || this.id === undefined || this.id === '') {
            console.log('id is empty');
            this.id = uuidv4()
        }
        this.setUI()
    }

    //render data
    setUI() {
        if (this.ui && this.ui instanceof HTMLElement) { return }
        this.ui = document.createElement("div")
        this.ui.className = 'project-card'
        this.ui.id = this.id //set id to the ui id
        this.ui.innerHTML = `
    <div class="card-header">
        <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1; text-transform: uppercase;">${this.name.split(" ").map((n) => n[0]).join("")}</p>

        <div>
            <h5 data-card-info='name'>${this.name}</h5>
            <p data-card-info='description'>${this.description}</p>
        </div>
    </div>
    <div class="card-content">
        <div class="card-property">
            <p style="color: #969696;">Status</p>
            <p data-card-info='status'>${this.status}</p>
        </div>
        <div class="card-property">
            <p style="color: #969696;">id</p>
            <p data-card-info='id'>${this.id}</p>
        </div>
        <div class="card-property">
            <p style="color: #969696;">Cost</p>
            <p data-card-info='cost'>$${this.cost}</p>
        </div>
        <div class="card-property">
            <p style="color: #969696;">Role</p>
            <p data-card-info='role'>${this.userRole}</p>
        </div>
        <div class="card-property">
            <p style="color: #969696;">Estimated Progress</p>
            <p data-card-info='progress'>${this.progress * 100}</p>
        </div>
</div>`}
}
