import { Modifier } from './modifier.model';

export class MultiplayerRole {
    constructor(public name: string,
                public description: string,
                public modifiers: Modifier[]) { }
}
