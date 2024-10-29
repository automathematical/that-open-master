import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import { TodoCreator } from './TodoCreator'
import { Priority, TodoData, TodoInput } from './base-types'

export interface TodoUIState {
    components: OBC.Components
}


export const todoTool = (state: TodoUIState) => {
    const { components } = state
    const todoCreator = components.get(TodoCreator)

    const nameInput = document.createElement('bim-text-input')
    nameInput.label = 'Name'
    const taskInput = document.createElement('bim-text-input')
    taskInput.label = 'Task'

    const priorityInput = BUI.Component.create<BUI.Dropdown>(() => {
        return BUI.html`
        <bim-dropdown label="Priority">
            <bim-option label='Low'></bim-option>
            <bim-option label='Medium'></bim-option>
            <bim-option label='High'></bim-option>
        </bim-dropdown>`
    })

    const todoModal = BUI.Component.create<HTMLDialogElement>(() => {
        return BUI.html`
        <dialog>
        <bim-panel style="width: 20rem">
        <bim-panel-section label='To-Do' fixed>
        <bim-label>Create A To Do For Future </bim-label>
        ${nameInput}
        ${taskInput}
        ${priorityInput}
        <bim-button icon = "pajamas:todo-done" label = "Create Todo"  @click=${() => {
                const TodoInput: TodoInput = {
                    name: nameInput.value,
                    task: taskInput.value,
                    priority: priorityInput.value[0] as Priority
                }
                todoCreator.addTodo(TodoInput)
                nameInput.value = ""
                taskInput.value = ""
                todoModal.close()
            }}
            > </bim-button>
                </bim-panel-section>
                <bim-panel-section >
                </dialog>
                    `
    })
    document.body.appendChild(todoModal)

    const onTogglePriority = (e: CustomEvent) => {
        const btn = e.target as BUI.Button
        btn.active = !btn.active
        todoCreator.enablePriorityHighlight = btn.active
    }


    const todoPriorityButton = BUI.Component.create<BUI.Button>(() => {
        return BUI.html`
        <bim-button @click=${onTogglePriority} icon="iconoir:fill-color" tooltip-title="Show Priority Filter"></bim-button>
            `
    })


    const todoButton = BUI.Component.create<BUI.Button>(() => {
        return BUI.html`
                <bim-button @click=${() => todoModal.showModal()} icon="pajamas:todo-done" tooltip-title="Todo"></bim-button>
                    `
    })

    todoCreator.onDisposed.add(() => {
        todoButton.remove()
        todoPriorityButton.remove()
        todoModal.remove()
    })


    return [todoButton, todoPriorityButton]
}
