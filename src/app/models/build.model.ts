import { JobLine } from './job.model';
import { Weapon } from './weapon.model';
import { Card } from './card.model';

export class Build {
    constructor(public job: JobLine,
                public weapon: Weapon,
                public card1: Card,
                public card2: Card,
                public card3: Card,
                public card4: Card) {}
}
