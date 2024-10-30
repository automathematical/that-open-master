import { IProject, Project } from "./Project"
import { ITodo, Todo } from "./Todo"

export class ProjectManager {
    list: Project[] = []
    ui: HTMLElement
    listTodo: Todo[] = []

    constructor(container: HTMLElement) {
        this.ui = container
        // Option to set default project/data
    }

    createProject(data: IProject) {
        this.checkNameLength(data)

        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        const peoplePage = document.getElementById('users-page')

        const project = new Project(data)
        const todo = new Todo(data)
        project.ui.addEventListener("click", () => {
            if (!projectsPage || !detailsPage) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project, todo)
            this.setRandomColor(project)
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

    createTodo(data: ITodo) {
        // Create a new Todo
        const todo = new Todo(data)
        this.listTodo.push(todo)
        console.log('Todo added to list:', this.listTodo);
    }

    setDetailsPage(project: Project, todo: Todo) {
        const detailsPage = document.getElementById('project-details')
        if (!detailsPage) { return }
        const initials = detailsPage.querySelector("[data-project-info='initials']")
        if (initials) { initials.textContent = project.name.split(" ").map((n) => n[0]).join("") }


        const cardName = detailsPage.querySelector("[data-project-info='cardName']")
        if (cardName) { cardName.textContent = project.name }

        const id = detailsPage.querySelector("[data-project-info='id']")
        if (id) { id.textContent = detailsPage.id }

        const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
        if (cardDescription) { cardDescription.textContent = project.description }

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

        const todoName = detailsPage.querySelector("[data-todo-info='name']")
        if (todoName) { todoName.textContent = todo.name }
        const todoDescription = detailsPage.querySelector("[data-todo-info='description']")
        if (todoDescription) { todoDescription.textContent = todo.description }
        const todoStatus = detailsPage.querySelector("[data-todo-info='status']")
        if (todoStatus) { todoStatus.textContent = todo.status }
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

        const newList: Project[] = []
        // const newTodoList: Todo[] = []
        for (const project of this.list) {
            if (project.id === data.id) {
                project.name = data.name
                project.description = data.description
                project.status = data.status
                project.userRole = data.userRole
                project.finishDate = data.finishDate
            }
            // for (const todo of project.todoList) {
            //     if (todo.id === data.id) {
            //         todo.name = data.name
            //         todo.description = data.description
            //         todo.status = data.status
            //         todo.finishDate = data.finishDate
            //     }
            // }
            // newTodoList.push(...project.todoList)
            newList.push(project)
        }
        this.list = newList
    }

    checkDuplicateID(id: string) {
        const projectIDs = this.list.map((project) => {
            return project.id
        })
        if (projectIDs.includes(id)) {
            throw new Error(`A project with the ID "${id}" already exists`)
        } else {
            console.log('Project ID is unique', id);
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

    setRandomColor(project: Project) {
        const colors = ['#5ed14f', ' #c5d14f', '#d17b4f', '#4f7bd1', '#4fbbd1']
        const bg = document.getElementById("card-icon")
        if (!bg) { return }
        bg.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
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