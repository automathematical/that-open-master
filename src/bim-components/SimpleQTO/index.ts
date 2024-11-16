import * as OBC from '@thatopen/components'

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
    static uuid = 'fce0b4c6-c208-4277-b8fb-6245c869eb96'
    enabled: boolean = true
    onDisposed: OBC.Event<any>;

    constructor(components: OBC.Components) {
        super(components)
        this.components.add(SimpleQTO.uuid, this)
    }

    async dispose() { }
}