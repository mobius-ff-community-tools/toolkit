import { AutoAbility } from './auto-ability.model';

export class Weapon {
    constructor(public readonly baseStats: WeaponStats,
                public modifications: WeaponStats = { hp: 0, attack: 0, breakPower: 0, magic: 0, crit: 0, speed: 0, defense: 0 },
                public autoAbilities: AutoAbility[]) {}

}

export class WeaponStats {
    constructor(public hp: number,
                public attack: number,
                public breakPower: number,
                public magic: number,
                public crit: number,
                public speed: number,
                public defense: number) {}
}
