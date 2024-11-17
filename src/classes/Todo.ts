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
    id: string

    constructor(data: ITodo, id: uuidv4) {
        for (const key in data) {
            this[key] = data[key]
        }
        if (this.id === null || this.id === undefined || this.id === '') {
            this.id = id
        }
    }
}
