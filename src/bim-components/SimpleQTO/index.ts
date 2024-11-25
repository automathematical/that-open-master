import * as OBC from '@thatopen/components'
import * as FRAGS from '@thatopen/fragments'

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
    static uuid = 'fce0b4c6-c208-4277-b8fb-6245c869eb96'
    enabled: boolean = true
    onDisposed: OBC.Event<any>;

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(SimpleQTO.uuid, this)
    }

    sumQuantities(fragmentsIdMap: FRAGS.FragmentIdMap) {
        const fragmenstManager = this.components.get(OBC.FragmentsManager)
        const modelIdMap = fragmenstManager.getModelIdMap(fragmentsIdMap)
        for (const modelId in modelIdMap) {
            const model = fragmenstManager.groups.get(modelId)
            if (!model) continue
            if (model.hasProperties) { return }
            console.log(model.getLocalProperties());

            // const quantities = model.getQuantities()
            // let sum = 0
            // for (const quantity of quantities) {
            //     sum += quantity
            // }
            // console.log(`Model ${modelId} has a total quantity of ${sum}`)
        }
    }

    async dispose() { }
}