
export
interface Hand
{
    id: number;
    thumb: Finger;
    pointer: Finger;
    middle: Finger;
    ring: Finger;
    pinky: Finger;
}

export
interface Finger
{
    id: number;
    hand: Hand;
}

export
let hand_left: Hand = {
    id: 123,
    thumb: { hand: undefined, id: 1 },
    pointer: { hand: undefined, id: 2 },
    middle: { hand: undefined, id: 3 },
    ring: { hand: undefined, id: 4 },
    pinky: { hand: undefined, id: 5 },
};
export
let hand_right: Hand = {
    id: 321,
    thumb: { hand: undefined, id: 6 },
    pointer: { hand: undefined, id: 7 },
    middle: { hand: undefined, id: 8 },
    ring: { hand: undefined, id: 9 },
    pinky: { hand: undefined, id: 10 },
};

hand_left.thumb.hand = hand_left;
hand_left.pointer.hand = hand_left;
hand_left.middle.hand = hand_left;
hand_left.ring.hand = hand_left;
hand_left.pinky.hand = hand_left;
hand_right.thumb.hand = hand_right;
hand_right.pointer.hand = hand_right;
hand_right.middle.hand = hand_right;
hand_right.ring.hand = hand_right;
hand_right.pinky.hand = hand_right;

export
interface BasicKeystroke
{
    primary_finger: Finger;
    primary_hand: Hand;
}

export
interface DetailedKeystroke extends BasicKeystroke
{
    row: number;
    column: number;
    label: string;
    wanted_character: string;
    pressed_modifiers: DetailedKeystroke[];
    pressed_key?: Key;
}

export
interface Key
{
    row: number;
    column: number;
    primary_finger: Finger;
    primary_hand: Hand;
    is_modifier: boolean;
    label: string;
    /**
     * List of typable characters on this key, with a note about which modifiers are required.
     */
    characters: {
        [character: string]: Key[];
    };
}

export
type Keystrokes<Key extends BasicKeystroke> = Array<Key>;

export
type FingerMap = [string, Finger][];

export
type KeyMap<Key extends BasicKeystroke> = { [label: string]: Key; };
