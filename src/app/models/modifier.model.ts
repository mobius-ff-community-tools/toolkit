import { ModifierKind } from './modifier-kind.enum';
import { ModifierContext } from './modifier-context.enum';

export class Modifier {
    constructor(private _value: number,
                public name: string,
                public kind: ModifierKind,
                public context: ModifierContext) { }

    get value(): number {
        return  (this.kind & ModifierKind.Percentage) ?
            this._value / 100 : this._value;
    }

    toString(): string {
        return `Modifier { value: ${this.value} name: ${this.name} kind: ${this.kind} context: ${this.context} }`;
    }
}
