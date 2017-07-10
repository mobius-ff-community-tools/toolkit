import { Modifier } from './modifier.model';
import { AbilityCategory } from './ability-category.enum';

export class AutoAbility {
    constructor(public readonly name: string,
                public readonly description: string,
                public readonly category: AbilityCategory,
                public readonly modifiers: Modifier[]) {}
}
