/// <reference path="../typings/index.d.ts" />

import * as def from './definitions';
import * as analyze from './analyze';
import * as lib from './lib';

import * as fs from 'fs';
import * as _ from 'underscore';

let keymap: def.KeyMap<def.DetailedKeystroke> = {};

function key(label, row, column, primary_finger: def.Finger, characters: { [character: string]: def.Key[] }, is_modifier = false)
{
    return {
        label: label,
        row: row,
        column: column,
        primary_finger: primary_finger,
        primary_hand: primary_finger.hand,
        is_modifier: is_modifier,
        characters: characters,
    };
}

function keystroke(wanted_character, key: def.Key, pressed_modifiers: def.DetailedKeystroke[] = [])
{
    return {
        row: key.row,
        column: key.column,
        label: key.label + ': ' + wanted_character.replace(/\n/gm, '\\n').replace(' ', 'Space'),
        wanted_character: wanted_character,
        pressed_modifiers: pressed_modifiers,
        pressed_key: key,
        primary_finger: key.primary_finger,
        primary_hand: key.primary_hand,
    };
}

interface Keycap
{
    label: string;
    characters: KeycapCharacters;
}

interface KeycapCharacters
{
    [character: string]: def.Keystrokes<def.DetailedKeystroke>;
}

function add_letter_to_keycap_characters(
    keycap_characters: KeycapCharacters,
    character,
    modifiers: def.DetailedKeystroke[]
) {
    return Object.defineProperty(keycap_characters, character, {
        value: modifiers,
    });
};

function letter_characters(letter: string, shift_keystroke: def.DetailedKeystroke)
    : KeycapCharacters
{
    return {
        [letter.toLowerCase()]: [],
        [letter.toUpperCase()]: [shift_keystroke],
    };
}

/**
 * we want labeled keyboards, so i'm restricting possible keys to existing keycaps available around the world
 *
 * for now i'll cover most of ANSI/ISO US/US-INT/DE/UK layouts. bear in mind
 * that i don't know all of the key combinations, though.
 *
 * pull requests are welcome!
 */
function possible_keycaps(
    shift_keystroke: def.DetailedKeystroke,
    alt_gr_keystroke: def.DetailedKeystroke,
    space_keytroke: def.DetailedKeystroke
) {
    // raw alphabet keys, no other characters with modifiers other than shift
    let keycaps = lib.alphanum_range('a', 'z').map(function (letter) {
        return {
            label: letter.toUpperCase(),
            characters: letter_characters(letter, shift_keystroke),
        };
    });

    // General
    keycaps.push({
        label: '1 - !',
        characters: {
            '1': [],
            '!': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '- - _',
        characters: {
            '-': [],
            '_': [shift_keystroke],
        },
    });

    // ANSI - US
    keycaps.push({
        label: '/ - ?',
        characters: {
            '/': [],
            '?': [shift_keystroke],
        },
    });
    keycaps.push({
        label: ', - <',
        characters: {
            ',': [],
            '<': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '. - >',
        characters: {
            '.': [],
            '>': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '\\ - |',
        characters: {
            '\\': [],
            '|': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '= - +',
        characters: {
            '=': [],
            '+': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '[ - {',
        characters: {
            '[': [],
            '{': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '] - }',
        characters: {
            ']': [],
            '}': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '; - :',
        characters: {
            ';': [],
            ':': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '\' - "',
        characters: {
            '\'': [],
            '"': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '` - ~',
        characters: {
            '`': [],
            '~': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '2 - @',
        characters: {
            '2': [],
            '@': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '3 - #',
        characters: {
            '3': [],
            '#': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '4 - ???',
        characters: {
            '4': [],
            '>': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '6 - ^',
        characters: {
            '6': [],
            '^': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '7 - &',
        characters: {
            '7': [],
            '&': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '8 - *',
        characters: {
            '8': [],
            '*': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '9 - (',
        characters: {
            '9': [],
            '(': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '0 - )',
        characters: {
            '0': [],
            ')': [shift_keystroke],
        },
    });

    // DE
    keycaps.push({
        label: 'Q + @',
        characters: add_letter_to_keycap_characters(letter_characters('q', shift_keystroke), '@', [alt_gr_keystroke]),
    });
    keycaps.push({
        label: 'E + €',
        characters: add_letter_to_keycap_characters(letter_characters('e', shift_keystroke), '€', [alt_gr_keystroke]),
    });
    keycaps.push({
        label: 'M + µ',
        characters: add_letter_to_keycap_characters(letter_characters('m', shift_keystroke), 'µ', [alt_gr_keystroke]),
    });
    keycaps.push({
        label: 'ß?\\',
        characters: {
            'ß': [],
            '?': [shift_keystroke],
            '\\': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '+*~',
        characters: {
            '+': [],
            '*': [shift_keystroke],
            '~': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '<>|',
        characters: {
            '<': [],
            '>': [shift_keystroke],
            '|': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '#\'',
        characters: {
            '#': [],
            '\'': [shift_keystroke],
        },
    });
    keycaps.push({
        label: ',;',
        characters: {
            ',': [],
            ';': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '.:',
        characters: {
            '.': [],
            ':': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '´`',
        characters: { // TODO: Since they are dead keys, add space modifier?
            '´': [],
            '`': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '^°',
        characters: {
            '^': [], // this is a dead key, too
            '°': [shift_keystroke], // this one is not
        },
    });
    // DE - Specific Numbers
    keycaps.push({
        label: '2 - "',
        characters: {
            '2': [],
            '"': [shift_keystroke],
            '²': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '3 - §',
        characters: {
            '3': [],
            '§': [shift_keystroke],
            '³': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '4 - $',
        characters: {
            '4': [],
            '$': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '5 - %',
        characters: {
            '5': [],
            '%': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '6 - &',
        characters: {
            '6': [],
            '&': [shift_keystroke],
        },
    });
    keycaps.push({
        label: '7 - /',
        characters: {
            '7': [],
            '/': [shift_keystroke],
            '{': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '8 - (',
        characters: {
            '8': [],
            '(': [shift_keystroke],
            '[': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '9 - )',
        characters: {
            '9': [],
            ')': [shift_keystroke],
            ']': [alt_gr_keystroke],
        },
    });
    keycaps.push({
        label: '0 - =',
        characters: {
            '0': [],
            '=': [shift_keystroke],
            '}': [alt_gr_keystroke],
        },
    });

    return keycaps;
}

let key_locations_iso = [
    _.range(14).map(column => [0, column]), // number row
    _.range(14).map(column => [1, column]), // qwert[yz] row, contains enter
    _.range(13).map(column => [2, column]), // asdf row, enter in row #1
    _.range(13).map(column => [3, column]), // shift row
    _.range(8).map(column => [4, column]), // space row
];

let key_locations_ansi = [
    _.range(14).map(column => [0, column]), // number row
    _.range(14).map(column => [1, column]), // qwert[yz] row, contains backslash
    _.range(14).map(column => [2, column]), // asdf row, contains enter
    _.range(12).map(column => [3, column]), // shift row
    _.range(8).map(column => [4, column]), // space row
];

let space_row = [
    key('LCtrl', 4, 0, def.hand_left.pinky, {}, true),
    key('LWin', 4, 1, def.hand_left.ring, {}, true),
    key('LAlt', 4, 2, def.hand_left.thumb, {}, true),
    key('Space', 4, 3, def.hand_left.thumb, { ' ': [] }, true),
    key('AltGr', 4, 4, def.hand_left.thumb, {}, true),
    key('RWin', 4, 5, def.hand_left.middle, {}, true),
    key('App', 4, 6, def.hand_left.ring, {}, true),
    key('RCtrl', 4, 7, def.hand_left.pinky, {}, true),
];

type KeymapEntry = number[] | def.Key;

function generate_keymap_empty_standard_mods(key_locations: number[][][], space_row: def.Key[], is_ansi = true)
    : KeymapEntry[][]
{
    let number_row: KeymapEntry[] = key_locations[0].slice(0, -1);
    let last_num_row_entry = key_locations[0].slice(-1)[0];
    number_row.push(key('Backspace', last_num_row_entry[0], last_num_row_entry[1], def.hand_right.pinky, {}, true));

    let qwert_row: KeymapEntry[] = key_locations[1].slice(1, -1);
    let first_qwert_row_entry = key_locations[1][0];
    let last_qwert_row_entry = key_locations[1].slice(-1)[0];
    qwert_row.unshift(key('Tab', first_qwert_row_entry[0], first_qwert_row_entry[1], def.hand_left.ring, { '\t': [] }, true));
    qwert_row.push(is_ansi ? last_num_row_entry : key('Enter', last_qwert_row_entry[0], last_qwert_row_entry[1], def.hand_right.pinky, { '\n': [] }, true));

    let asdf_row: KeymapEntry[] = key_locations[2].slice(1, -1);
    let first_asdf_row_entry = key_locations[2][0];
    let last_asdf_row_entry = key_locations[2].slice(-1)[0];
    asdf_row.unshift(key('Caps Lock', first_asdf_row_entry[0], first_asdf_row_entry[1], def.hand_left.pinky, {}, true));
    if (is_ansi)
    {
        asdf_row.push(key('Enter', last_asdf_row_entry[0], last_asdf_row_entry[1], def.hand_right.pinky, { '\n': [] }, true));
    } else {
        asdf_row.push(last_asdf_row_entry);
    }

    let shift_row: KeymapEntry[] = key_locations[3].slice(1, -1);
    let first_shift_row_entry = key_locations[3][0];
    let last_shift_row_entry = key_locations[3].slice(-1)[0];
    shift_row.unshift(key('LShift', first_shift_row_entry[0], first_shift_row_entry[1], def.hand_left.pinky, {}, true));
    shift_row.push(key('RShift', last_shift_row_entry[0], last_shift_row_entry[1], def.hand_right.pinky, {}, true));

    return [
        number_row,
        qwert_row,
        asdf_row,
        shift_row,
        space_row,
    ];
}

let required_keys = [
    ...lib.alphanum_range('a', '9'),
    ...'{}[]()#\'"$&%!/\\?-_,.;:+*~`=<>|'.split(''),
];

let empty_board_ansi = generate_keymap_empty_standard_mods(key_locations_ansi, space_row, true);

let shift_key = empty_board_ansi[3][0] as def.Key;
let alt_gr_key = empty_board_ansi[4][4] as def.Key;
let space_key = empty_board_ansi[4][3] as def.Key;

let keycaps = possible_keycaps(keystroke('Shift', shift_key), keystroke('AltGr', alt_gr_key), keystroke('Space', space_key));

let keys_by_character = _.groupBy(keycaps.map(keycap => _.map(keycap.characters, (x, character) => [character, keycap] as [string, Keycap])).reduce((prev, val) => prev.concat(val), []), 0);

