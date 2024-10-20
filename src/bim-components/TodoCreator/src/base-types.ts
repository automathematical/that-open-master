export interface TodoInput {
    name: string
    task: string
    ifcGuids: string[]
}

export interface TodoData {
    name: string
    task: string
    ifcGuids: string[]
    camera: { position: THREE.Vector3, target: THREE.Vector3 }
}