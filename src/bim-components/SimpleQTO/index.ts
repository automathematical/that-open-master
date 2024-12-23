import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'
import * as WEBIFC from 'web-ifc'

type QtoResult = { [setName: string]: { [qtoName: string]: number } }

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
    static uuid = 'fce0b4c6-c208-4277-b8fb-6245c869eb96'
    enabled: boolean = true
    onDisposed: OBC.Event<any>;
    private _qtoResult: QtoResult = {}

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(SimpleQTO.uuid, this)
    }

    resetQuantities() {
        this._qtoResult = {}
    }

    // V1 uses the IfcPropertiesUtils to get the whole relation map
    async sumQuantities(fragmentsIdMap: FRAGS.FragmentIdMap) {
        // console.time("quantities V1")

        const fragmenstManager = this.components.get(OBC.FragmentsManager) // Get fragments manager
        const modelIdMap = fragmenstManager.getModelIdMap(fragmentsIdMap) // Get model ID map
        for (const modelId in modelIdMap) { // Iterate over model IDs
            const model = fragmenstManager.groups.get(modelId) // Get model
            if (!model) continue
            if (!model.hasProperties) { return }
            await OBC.IfcPropertiesUtils.getRelationMap(model, WEBIFC.IFCRELDEFINESBYPROPERTIES, async (setID, relatedIDs) => { // Get relation map
                const set = await model.getProperties(setID) // Get set properties
                const expressID = modelIdMap[modelId] // Get model IDs
                const workingIDs = relatedIDs.filter(id => expressID.has(id)) // Filter only working IDs
                const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID) // Get set name
                if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) { return } // Only ElementQuantity
                if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} } // Create set name
                await OBC.IfcPropertiesUtils.getQsetQuantities( // Get quantities
                    model,
                    setID,
                    async (qtoID) => {
                        const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID) // Get quantity name
                        const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoID)
                        if (!qtoName || !value) { return }
                        if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 } // Create quantity name
                        this._qtoResult[setName][qtoName] += value // Sum quantities
                    }
                )
            })
        }
        // console.log(this._qtoResult);
        // console.timeEnd("quantities V1")
    }

    // V2 uses the IfcRelationsIndexer to get the IsDefinedBy relation
    async sumQuantitiesV2(fragmentsIdMap: FRAGS.FragmentIdMap) {
        // console.time("quantities V2")
        const fragmenstManager = this.components.get(OBC.FragmentsManager) // Get fragments manager
        const modelIdMap = fragmenstManager.getModelIdMap(fragmentsIdMap) // Get model ID map
        for (const modelId in modelIdMap) { // Iterate over model IDs
            const model = fragmenstManager.groups.get(modelId) // Get model
            if (!model) continue
            if (!model.hasProperties) { return }
            for (const fragmentId in fragmentsIdMap) { // Iterate over fragment IDs
                const expressIDs = fragmentsIdMap[fragmentId] // Get fragment IDs
                const indexer = this.components.get(OBC.IfcRelationsIndexer)// Get model indexer
                for (const id of expressIDs) { // Iterate over fragment IDs
                    const sets = indexer.getEntityRelations(model, id, "IsDefinedBy") // Get related sets
                    if (!sets) { continue }
                    for (const expressID of sets) { // Iterate over sets
                        const set = await model.getProperties(expressID) // Get set properties
                        const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, expressID) // Get set name
                        if (!setName || set?.type !== WEBIFC.IFCELEMENTQUANTITY || !setName) { continue } // Only ElementQuantity
                        if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} } // Create set name
                        await OBC.IfcPropertiesUtils.getQsetQuantities( // Get quantities
                            model,
                            expressID,
                            async (qtoID) => {
                                const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID) // Get quantity name
                                const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoID)
                                if (!qtoName || !value) { return }
                                if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 } // Create quantity name
                                this._qtoResult[setName][qtoName] += value // Sum quantities
                            }
                        )
                    }
                }
            }
        }
        // console.log(this._qtoResult);
        // console.timeEnd("quantities V2")
    }


    async dispose() { this.resetQuantities() }
}