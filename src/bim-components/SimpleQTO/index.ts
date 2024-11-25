import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'
import * as WEBIFC from 'web-ifc'

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
    static uuid = 'fce0b4c6-c208-4277-b8fb-6245c869eb96'
    enabled: boolean = true
    onDisposed: OBC.Event<any>;

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(SimpleQTO.uuid, this)
    }

    async sumQuantities(fragmentsIdMap: FRAGS.FragmentIdMap) {
        const fragmenstManager = this.components.get(OBC.FragmentsManager)
        const modelIdMap = fragmenstManager.getModelIdMap(fragmentsIdMap)
        for (const modelId in modelIdMap) {
            const model = fragmenstManager.groups.get(modelId)
            if (!model) continue
            // if (model.hasProperties) { return }
            await OBC.IfcPropertiesUtils.getRelationMap(model, WEBIFC.IFCRELDEFINESBYPROPERTIES, async (setID, relatedIDs) => {
                const set = await model.getProperties(setID)
                if (set?.type !== WEBIFC.IFCELEMENTQUANTITY) { return }
                console.log(set);
            })
        }
    }

    async dispose() { }
}