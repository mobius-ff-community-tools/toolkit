import { ModifierKind } from './modifier-kind.enum';
import { ModifierApplication } from './modifier-application.enum';

export class Modifier {
    constructor(public value: number,
                public kind: ModifierKind,
                public applies: ModifierApplication) { }
}
