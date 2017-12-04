export const enum ModifierTrait {
    None,
    Ailment        = 1 << 0,
    BaseValue      = 1 << 1,
    Boon           = 1 << 2,
    Break          = 1 << 3,
    Critical       = 1 << 4,
    Damage         = 1 << 5,
    ElementEnhance = 1 << 6,
    Fractal        = 1 << 7,
    Imbue          = 1 << 8,
    Independent    = 1 << 9,
    Magic          = 1 << 10,
    Multiplayer    = 1 << 11,
    Percentage     = 1 << 12,
    Weakness       = 1 << 13,
    PiercingBreak  = 1 << 14
}

export function modifierTraitToString(trait: ModifierTrait): string {
    switch (trait) {
        case ModifierTrait.None:
            return 'None';
        case ModifierTrait.Ailment:
            return 'Ailment';
        case ModifierTrait.BaseValue:
            return 'Base Value';
        case ModifierTrait.Boon:
            return 'Boon';
        case ModifierTrait.Break:
            return 'Break';
        case ModifierTrait.Critical:
            return 'Critical';
        case ModifierTrait.Damage:
            return 'Damage';
        case ModifierTrait.ElementEnhance:
            return 'Enhance Element';
        case ModifierTrait.Fractal:
            return 'Fractal';
        case ModifierTrait.Imbue:
            return 'Imbue';
        case ModifierTrait.Independent:
            return 'Independent';
        case ModifierTrait.Magic:
            return 'Magic';
        case ModifierTrait.Multiplayer:
            return 'Multiplayer';
        case ModifierTrait.Percentage:
            return 'Percentage';
        case ModifierTrait.Weakness:
            return 'Weakness';
    }
}
