import { AutoAbility } from './auto-ability.model';
import { Panel } from './panel.model';

export class JobLine {
    constructor(public name: string,
                public description: string,
                public thumbnailUrl: string,
                public overboostLevel: number,
                public autoAbilities: AutoAbility[],
                public job: Job,
                public skillPanels: Panel[],
                public customPanels: Panel[]) {}

}

export class Job {
    constructor(public name: string,
                public description: string,
                public thumbnailUrl: string,
                public baseAttack: number,
                public baseBreak: number,
                public baseMagic: number,
                public baseCrit: number,
                public baseSpeed: number,
                public baseDefense: number) {}
}
