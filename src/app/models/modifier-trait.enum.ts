export const enum ModifierTrait {
    None,
    Damage           = 1 << 1,
    Magic            = 1 << 2,
    Multiplayer      = 1 << 3,
    Break            = 1 << 4,
    BaseValue        = 1 << 5,
    Boon             = 1 << 6,
    Ailment          = 1 << 7,
    ElementEnhance   = 1 << 8,
    Critical         = 1 << 9,
    Independent      = 1 << 10,
    Percentage       = 1 << 11
}
