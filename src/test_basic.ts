import * as def from './definitions';
import * as analyze from './analyze';

//import * as process from 'process';
import * as fs from 'fs';

function basic_keystroke(finger: def.Finger)
{
    return { primary_finger: finger, primary_hand: finger.hand };
}

let keymap: def.KeyMap<def.BasicKeystroke> = {};

function add_key(label: string, key: def.BasicKeystroke)
{
    keymap[label.toUpperCase()] = key;
}

var finger_map_ISO_DE_BASIC: def.FingerMap = [
    ['Q', def.hand_left.pinky],
    ['W', def.hand_left.ring],
    ['E', def.hand_left.middle],
    ['R', def.hand_left.pointer],
    ['T', def.hand_left.pointer],
    ['Z', def.hand_right.pointer],
    ['U', def.hand_right.pointer],
    ['I', def.hand_right.middle],
    ['O', def.hand_right.ring],
    ['P', def.hand_right.pinky],
    ['A', def.hand_left.pinky],
    ['S', def.hand_left.ring],
    ['D', def.hand_left.middle],
    ['F', def.hand_left.pointer],
    ['G', def.hand_left.pointer],
    ['H', def.hand_right.pointer],
    ['J', def.hand_right.pointer],
    ['K', def.hand_right.middle],
    ['L', def.hand_right.ring],
    ['Y', def.hand_left.ring],
    ['X', def.hand_left.middle],
    ['C', def.hand_left.pointer],
    ['V', def.hand_left.pointer],
    ['B', def.hand_right.pointer],
    ['N', def.hand_right.pointer],
    ['M', def.hand_right.pointer],
    ['-', def.hand_right.pinky],
    ['_', def.hand_right.pinky],
    ['#', def.hand_right.pinky],
    [';', def.hand_right.middle],
    [':', def.hand_right.middle],
    [',', def.hand_right.middle],
    ['.', def.hand_right.ring],
    ['=', def.hand_right.middle], // I do it with this finger, k?
    [' ', def.hand_left.thumb],
    ['(', def.hand_right.pointer],
    [')', def.hand_right.pointer],
    ['[', def.hand_right.pointer],
    [']', def.hand_right.pointer],
    ['{', def.hand_right.pointer],
    ['}', def.hand_right.middle],
    ['?', def.hand_right.pointer],
    ['|', def.hand_left.pinky],
    ['/', def.hand_right.pointer],
    ['\\', def.hand_right.ring],
    ['$', def.hand_left.pointer],
    ['>', def.hand_left.pinky],
    ['<', def.hand_left.pinky],
    ['"', def.hand_left.ring],
    ['\'', def.hand_right.pinky],
    //['\n', def.hand_right.pinky],
];
finger_map_ISO_DE_BASIC.forEach((v) => add_key(v[0], basic_keystroke(v[1])));

function build_key_getter<Key extends def.BasicKeystroke>(keymap: def.KeyMap<Key>)
{
    return function (letter: string)
    {
        let key = keymap[letter];
        if (!key) {
            console.log('No key found for following letter:' + letter);
        }
        return key;
    }
}

let key = build_key_getter(keymap);

function word_to_strokes(word: string): def.Keystrokes<def.BasicKeystroke>
{
    return word.toUpperCase().split('').map(key).filter(_ => !!_);
}

function count_elements(list: string[])
{
    let map: { [element: string]: number } = {};

    list.map(_ => _.toUpperCase()).forEach(element => map[element] = (map[element] || 0) + 1);

    return map;
}

let valid_chars = [];
for (let key in keymap) {
    if (keymap.hasOwnProperty(key)) {
        valid_chars.push(key);
    }
}

class RegExpConstructor
{
    quote: (str: string) => string;
}

RegExp.quote = function (str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

let argv = process.argv.slice(2);

///@global process
// console.log(analyze.rate_keystroke_sequence(word_to_strokes('function')));
argv.forEach(function (arg: string) {
    fs.readFile(arg, 'utf8', function (err, data: string) {
        if (err) {
            console.log(err);
            return;
        }

        data = data.replace(/(\r\n)+/gm, ' ');
        data = data.replace(/\n+/gm, ' ');
        data = data.replace(new RegExp('(?![' + RegExp.quote(valid_chars.join('')) + '])+', 'i'), ' ');

        let words = data.split(' ');
        let counts = count_elements(words);
        let result = {};
        for (let element in counts) {
            if (counts.hasOwnProperty(element)) {
                result[element] = {
                    word: element,
                    score: analyze.rate_keystroke_sequence_basic(word_to_strokes(element)),
                    count: counts[element],
                };
            }
        }
        console.log(result);
    });
});