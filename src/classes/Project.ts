import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
}

export class Project implements IProject {
    //To satisfy IProject
    name: string
    description: string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date

    //Class internals
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject, id: uuidv4) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = id
    }
}
