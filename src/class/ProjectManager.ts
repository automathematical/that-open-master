import { IProject, Project } from "./Project"

export class ProjectManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
        // const project = this.newProject({
        //     name: "Default Project",
        //     description: "This is just a default app project",
        //     status: "pending",
        //     userRole: "architect",
        //     finishDate: new Date()
        // })
        // project.ui.click()
    }

    newProject(data: IProject) {
        this.checkDuplicate(data)
        this.checkNameLength(data)

        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        const peoplePage = document.getElementById('users-page')

        const project = new Project(data)
        console.log(project.ui);

        project.ui.addEventListener("click", () => {
            if (!projectsPage || !detailsPage) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project) // set details page for the project
            this.setRandomColor(project) // set random color for the project card
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
    }

    editProject(id: string, data: IProject) {
        const project = this.getProjectByID(id)
        if (!project) { return }
        for (const key in data) {
            project[key] = data[key]
        }
        this.setDetailsPage(project)
        this.setRandomColor(project)
    }

    checkDuplicate(data: IProject) {
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

    addProject(project: IProject) {
        const newProject = this.newProject(project)
        return newProject
    }

    setDetailsPage(project: Project) {
        const detailsPage = document.getElementById('project-details')
        if (!detailsPage) { return }

        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) { name.textContent = project.name }
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) { description.textContent = project.description }

        const initials = detailsPage.querySelector("[data-project-info='initials']")
        if (initials) { initials.textContent = project.name.split(" ").map((n) => n[0]).join("") }
        const cardName = detailsPage.querySelector("[data-project-info='cardName']")
        if (cardName) { cardName.textContent = project.name }

        const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
        if (cardDescription) { cardDescription.textContent = project.description }

        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }
        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if (userRole) { userRole.textContent = project.userRole }
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) { cost.textContent = project.cost.toString() }
        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
        if (finishDate) { finishDate.textContent = project.finishDate.toDateString() }
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
                    this.newProject(project)
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