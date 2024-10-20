import * as OBC from '@thatopen/components'

export interface TodoData {
    name: string
    task: string
}

export class TodoCreator extends OBC.Component {
    static uuid = '9ea007eb-5082-48cc-8f6f-09f13f649cd8'
    enabled = true
    onTodoCreated = new OBC.Event<TodoData>()

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(TodoCreator.uuid, this)
    }

    addTodo(data: TodoData) {
        this.onTodoCreated.trigger(data)
    }
}

