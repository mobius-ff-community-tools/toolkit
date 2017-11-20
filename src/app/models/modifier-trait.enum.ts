export const enum ModifierTrait {
    None,
    Ailment          = 1 << 0,
    BaseValue        = 1 << 1,
    Boon             = 1 << 2,
    Break            = 1 << 3,
    Critical         = 1 << 4,
    Damage           = 1 << 5,
    ElementEnhance   = 1 << 6,
    Fractal          = 1 << 7,
    Imbue            = 1 << 8,
    Independent      = 1 << 9,
    Magic            = 1 << 10,
    Multiplayer      = 1 << 11,
    Percentage       = 1 << 12,
    Weakness         = 1 << 13
}
