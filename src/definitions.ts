
export
module Hand {
    interface Hand { }

    var Left: Hand;
    var Right: Hand;
}

export
module Finger {
    interface Finger { }

    var Thumb: Finger;
    var Pointer: Finger;
    var Middle: Finger;
    var Ring: Finger;
    var Pinky: Finger;
}

export
module Keygroup {
    interface Keygroup { }

    var Alpha: Keygroup;
    var Modifier: Keygroup;
}

export
module AlphaGroup {
    interface CharacterGroup {
        isShiftable: boolean;
     }

    var Letter: CharacterGroup;
    var Digit: CharacterGroup;
    /** e.g. Space and Tab */
    var Whitespace: CharacterGroup;
    /** e.g. Slash, Dash */
    var Special: CharacterGroup;
    var NonPrintable: CharacterGroup;
}

export
module Modifiers {
    interface Modifiers { }

    var Ctrl: Modifiers;
    var Shift: Modifiers;
    var Alt: Modifiers;
    var AltGr: Modifiers;
    var Tab: Modifiers;
}
