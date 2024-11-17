import { IProject, Project } from "./Project"

export class ProjectManager {
    list: Project[] = []
    onProjectCreated = (project: Project) => { }
    onProjectDeleted = (id: string) => { }
    onProjectUpdated = (project: Project) => { }

    filterProjects = (value: string) => {
        const filteredProjects = this.list.filter((project) => {
            return project.name.includes(value)
        })
        return filteredProjects
    }

    newProject(data: IProject, id?: string) {
        this.checkNameLength(data)
        this.checkDuplicateName(data)

        const project = new Project(data, id)
        this.list.push(project)
        this.onProjectCreated(project)

        return project
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

    checkNameLength(data: IProject) {
        const nameLength = data.name.length
        if (nameLength < 5) {
            throw new Error('Name is too short')
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

    setRandomColor(project: Project) {
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
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        this.onProjectDeleted(id)
    }

    updateProject(project: Project) {
        const index = this.list.findIndex((p) => p.id === project.id);
        if (index === -1) {
            throw new Error(`Project with id "${project.id}" not found`);
        }
        this.list[index] = project;
        this.onProjectUpdated(project);
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