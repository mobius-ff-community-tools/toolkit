import { AutoAbility } from './auto-ability.model';
import { Modifier } from './modifier.model';

export class ExtraSkill extends AutoAbility {
    constructor(name: string, description: string, thumbnailUrl: string, modifiers: Modifier[], public unlocked: boolean) {
        super(name, description, thumbnailUrl, modifiers);
    }
}
