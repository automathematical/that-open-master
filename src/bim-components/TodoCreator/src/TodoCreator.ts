import * as OBC from '@thatopen/components'

export class TodoCreator extends OBC.Component {
    static uuid = '9ea007eb-5082-48cc-8f6f-09f13f649cd8'
    enabled = true

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(TodoCreator.uuid, this)
    }

    addTodo() {
        console.log('Add Todo')
    }
}

