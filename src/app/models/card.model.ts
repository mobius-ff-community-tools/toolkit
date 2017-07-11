import { AutoAbility } from './auto-ability.model';
import { ExtraSkill } from './extra-skill.model';

export class Card {
    constructor(public abilityLevel: number = 1,
                public cardLevel: number = 1,
                public autoAbilities: AutoAbility[],
                public extraSkills: ExtraSkill[],
                public fractal1: AutoAbility,
                public fractal2: AutoAbility) {}
}
