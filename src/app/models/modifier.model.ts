import { ModifierKind } from './modifier-kind.enum';
import { ModifierContext } from './modifier-context.enum';

export class Modifier {
    constructor(public value: number,
                public kind: ModifierKind,
                public context: ModifierContext) { }
}
