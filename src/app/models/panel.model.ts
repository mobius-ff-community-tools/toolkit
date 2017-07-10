import { Modifier } from './modifier.model';
import { AbilityCategory } from './ability-category.enum';

export class Panel {
    constructor(public name: string, public cost: number, public modifiers: Modifier[]) { }
}
