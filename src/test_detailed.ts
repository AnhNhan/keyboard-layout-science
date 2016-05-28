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

function letter_characters(letter: string, shift_keystroke: def.DetailedKeystroke)
{
    return {
        [letter.toLowerCase()]: [],
        [letter.toUpperCase()]: [shift_keystroke],
        add: function (character, modifiers: def.DetailedKeystroke[]) {
            return Object.defineProperty(this, character, {
                value: modifiers,
            });
        },
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
function possible_keycaps(shift_keystroke: def.DetailedKeystroke, alt_gr_keystroke: def.DetailedKeystroke) {
    // raw alphabet keys, no other characters with modifiers other than shift
    let keycaps = lib.alphanum_range('a', 'z').map(function (letter) {
        return {
            label: letter.toUpperCase(),
            characters: letter_characters(letter, shift_keystroke),
        };
    });

    // DE
    keycaps.push({
        label: 'Q + @',
        characters: letter_characters('q', shift_keystroke).add('@', [alt_gr_keystroke]),
    });
    keycaps.push({
        label: 'E + €',
        characters: letter_characters('e', shift_keystroke).add('€', [alt_gr_keystroke]),
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
