import { IProject, Project } from "./Project"

export class ProjectManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const nameLength = data.name.length
        if (nameLength < 5) {
            throw new Error('Name is too short')
        }

        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
            this.setRandomColor(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setRandomColor(project: Project) {
        const colors = ['#5ed14f', '#c5d14f', '#d17b4f', '#4f7bd1', '#4fbbd1']
        const bg = document.getElementById("card-icon")
        if (!bg) { return }
        bg.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById('project-details')
        if (!detailsPage) { return }
        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) { name.textContent = project.name }
        const initials = detailsPage.querySelector("[data-project-info='initials']")
        if (initials) { initials.textContent = project.name.split(" ").map((n) => n[0]).join("") }
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) { description.textContent = project.description }
        const cardName = detailsPage.querySelector("[data-project-info='cardName']")
        if (cardName) { cardName.textContent = project.name }
        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) { status.textContent = project.status }
    }

    getProject(id: string) {
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
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    // updateProject(id: string) {
    //     const project = this.getProject(id)
    //     if (!project) { return }
    // }

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