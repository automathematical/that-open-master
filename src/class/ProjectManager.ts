import { IProject, Project } from "./Project"
import { ITodo, Todo } from "./Todo"

export class ProjectManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        // Set the container for the projects
        this.ui = container
        // Option to set default project/data here
        // ...
    }

    createProject(data: IProject) {
        this.checkNameLength(data)

        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        const peoplePage = document.getElementById('users-page')

        if (this.checkDuplicateID(data.id)) {
            console.log('Duplicate ID:', data.id);
            this.updateProject(data)
        } else {

            const project = new Project(data)
            console.log('Unique ID:', project.id);

            project.ui.addEventListener("click", () => {
                if (!projectsPage || !detailsPage) { return }
                projectsPage.style.display = "none"
                detailsPage.style.display = "flex"
                this.setDetailsPage(project)
                this.setRandomColor()
            })

            const projectsNavBtn = document.getElementById('projects-navbtn')
            if (projectsNavBtn) {
                projectsNavBtn.addEventListener("click", () => {
                    if (!projectsPage || !detailsPage) { return }
                    projectsPage.style.display = "flex"
                    detailsPage.style.display = "none"
                })
            }

            const usersNavBtn = document.getElementById('users-navbtn')
            if (usersNavBtn) {
                usersNavBtn.addEventListener("click", () => {
                    if (!projectsPage || !detailsPage || !peoplePage) { return }
                    peoplePage.style.display = 'flex'
                    projectsPage.style.display = "none"
                    detailsPage.style.display = "none"
                })
            }

            this.ui.append(project.ui)
            this.list.push(project)

            console.log('Project and added to list:', this.list);
        }
    }

    setDetailsPage(project: Project) {
        // Set the details page with the project data
        const detailsPage = document.getElementById('project-details')
        if (!detailsPage) { return }
        const initials = detailsPage.querySelector("[data-project-info='initials']")
        if (initials) { initials.textContent = project.name.split(" ").map((n) => n[0]).join("") }

        // Project details
        const detailsName = detailsPage.querySelector("[data-project-info='name']")
        if (detailsName) { detailsName.textContent = project.name }

        const detailsDescription = detailsPage.querySelector("[data-project-info='description']")
        if (detailsDescription) { detailsDescription.textContent = project.description }

        const cardName = detailsPage.querySelector("[data-project-info='cardName']")
        if (cardName) { cardName.textContent = project.name }

        const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
        if (cardDescription) { cardDescription.textContent = project.description }

        const id = detailsPage.querySelector("[data-project-info='id']")
        if (id) { id.textContent = project.id }

        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }
        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if (userRole) { userRole.textContent = project.userRole }
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) { cost.textContent = project.cost.toString() }
        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']");
        if (finishDate) {
            const date = new Date(project.finishDate);
            if (!isNaN(date.getTime())) {
                finishDate.textContent = date.toDateString();
            } else {
                console.error('Invalid date:', project.finishDate);
                finishDate.textContent = 'Invalid date';
            }
        }
    }

    updateTodoDetails(todo: Todo) {
        const detailsPage = document.getElementById('project-details')
        if (!detailsPage) { return }

        if (!todo) {
            console.log('No todo data'); return
        }
        // const todoName = detailsPage.querySelector("[data-todo-info='name']")
        // if (todoName) { todoName.textContent = todo[0].name }
        const todoStatus = detailsPage.querySelector("[data-todo-info='status']")
        if (todoStatus) { todoStatus.textContent = todo.status }
        const todoDescription = detailsPage.querySelector("[data-todo-info='description']")
        if (todoDescription) { todoDescription.textContent = todo.description }
        const todoFinishDate = detailsPage.querySelector("[data-todo-info='finishDate']")
        if (todoFinishDate) {
            const date = new Date(todo.finishDate);
            if (!isNaN(date.getTime())) {
                todoFinishDate.textContent = date.toDateString();
            } else {
                console.error('Invalid date:', todo.finishDate);
                todoFinishDate.textContent = 'Invalid date';
            }
        }

    }

    updateProject(data: IProject) {
        this.checkNameLength(data)
        console.log('Project data:', data);

        const newList: Project[] = []
        for (const project of this.list) {
            for (const key in project) {
                project[key] = data[key]
            }
            newList.push(project)
            this.setDetailsPage(project)
        }
        this.list = newList

        // Update the UI
        const cardName = document.querySelector("[data-card-info='name']")
        if (cardName) { cardName.textContent = data.name }
        const cardDescription = document.querySelector("[data-card-info='description']")
        if (cardDescription) { cardDescription.textContent = data.description }
        const status = document.querySelector("[data-card-info='status']")
        if (status) { status.textContent = data.status }
        const userRole = document.querySelector("[data-card-info='userRole']")
        if (userRole) { userRole.textContent = data.userRole }
    }

    updateTodo(data: ITodo) {
        // Update a Todo
        const newList: Todo[] = []
        for (const todo of this.list[0].todoList) {
            for (const key in todo) {
                todo[key] = data[key]
            }
            newList.push(todo)
        }
        this.list[0].todoList = newList
        console.log('Todo updated:')

        // Update the UI
        const todoStatus = document.querySelector("[data-todo-info='status']")
        if (todoStatus) { todoStatus.textContent = data.status }

    }

    checkDuplicateID(id: string) {
        const projectIDs = this.list.map((project) => {
            return project.id
        })
        if (projectIDs.includes(id)) {
            // throw new Error(`A project with the ID "${id}" already exists`)
            console.log('Project ID already exists', id);
            return true
        } else {
            console.log('Project ID is unique', id);
            return false
        }
    }

    checkDuplicateName(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
    }

    checkNameLength(data: IProject) {
        const nameLength = data.name.length
        if (nameLength < 5) {
            throw new Error('Name is too short')
        }
    }

    setRandomColor() {
        const colors = ['#5ed14f', ' #c5d14f', '#d17b4f', '#4f7bd1', '#4fbbd1']
        const bg = document.getElementById("card-icon")
        if (!bg) { return }
        bg.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    }

    setStateColor(status: string) {
        const red = '#ff0000'
        const yellow = '#ffff00'
        const green = '#008000'
        const bg = document.getElementById("todo-status")
        console.log('bg:', bg);
        if (!bg) { return }
        switch (status) {
            case 'Active':
                bg.style.backgroundColor = red;
                break;
            case 'Pending':
                bg.style.backgroundColor = yellow;
                break;
            case 'Finished':
                bg.style.backgroundColor = green;
                break;
            default:
                console.warn('Unknown status:', status);
        }
    }

    getProjectByID(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    deleteProject(id: string) {
        const projectIndex = this.list.findIndex((project) => project.id === id)
        if (projectIndex === -1) { return }
        this.list[projectIndex].ui.remove()
        this.list.splice(projectIndex, 1) // remove the project from the list
    }

    calcTotalCost() {
        const totalCost: number = this.list.reduce(
            (sum, project) => sum + project.cost, 0
        )
        return totalCost
    }

    exportProject(FileName: string = 'projects') {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = FileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.createProject(project)
                } catch (error) {
                    console.error(error)
                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }

}