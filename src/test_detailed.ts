/// <reference path="../typings/index.d.ts" />

import * as def from './definitions';
import * as analyze from './analyze';
import * as lib from './lib';

import * as fs from 'fs';
import * as _ from 'lodash';

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
 * we want labeled keyboards, so i'm restricting possible keys to existing keycaps
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
    key('LWin', 4, 0, def.hand_left.ring, {}, true),
    key('LAlt', 4, 0, def.hand_left.thumb, {}, true),
    key('Space', 4, 0, def.hand_left.thumb, { ' ': [] }, true),
    key('AltGr', 4, 0, def.hand_left.thumb, {}, true),
    key('RWin', 4, 0, def.hand_left.middle, {}, true),
    key('App', 4, 0, def.hand_left.ring, {}, true),
    key('RCtrl', 4, 0, def.hand_left.pinky, {}, true),
];
