import { ModifierTrait } from './modifier-trait.enum';
import { ModifierContext } from './modifier-context.enum';

export class Modifier {
    constructor(private _value: number,
                public name: string,
                public traits: ModifierTrait,
                public context: ModifierContext) { }

    get value(): number {
        let result = this._value;

        if (this.traits & ModifierTrait.Percentage) {
            result = result / 100;

            if (this.traits & ModifierTrait.Independent) {
                result += 1;
            }
        }

        return result;
    }

    toString(): string {
        return `Modifier { value: ${this.value} name: ${this.name} traits: ${this.traits} context: ${this.context} }`;
    }
}
