import { ModifierTrait } from './modifier-trait.enum';
import { ModifierContext } from './modifier-context.enum';

export class Modifier {
    constructor(private _value: number,
                public name: string,
                public traits: ModifierTrait,
                public context: ModifierContext) { }

    get value(): number {
        return  (this.traits & ModifierTrait.Percentage) ?
            this._value / 100 : this._value;
    }

    toString(): string {
        return `Modifier { value: ${this.value} name: ${this.name} traits: ${this.traits} context: ${this.context} }`;
    }
}
