import { AutoAbility } from './auto-ability.model';
import { AbilityCategory } from './ability-category.enum';
import { Modifier } from './modifier.model';

export class ExtraSkill extends AutoAbility {
    constructor(name: string,
                description: string,
                thumbnailUrl: string,
                category: AbilityCategory,
                modifiers: Modifier[],
                public unlocked: boolean) {
        super(name, description, thumbnailUrl, category, modifiers);
    }
}
