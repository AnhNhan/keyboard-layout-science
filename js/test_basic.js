(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './definitions', './analyze', 'fs'], factory);
    }
})(function (require, exports) {
    "use strict";
    var def = require('./definitions');
    var analyze = require('./analyze');
    //import * as process from 'process';
    var fs = require('fs');
    function basic_keystroke(finger) {
        return { primary_finger: finger, primary_hand: finger.hand };
    }
    var keymap = {};
    function add_key(label, key) {
        keymap[label.toUpperCase()] = key;
    }
    var finger_map_ISO_DE_BASIC = [
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
        ['=', def.hand_right.middle],
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
    ];
    finger_map_ISO_DE_BASIC.forEach(function (v) { return add_key(v[0], basic_keystroke(v[1])); });
    function build_key_getter(keymap) {
        return function (letter) {
            var key = keymap[letter];
            if (!key) {
                console.log('No key found for following letter:' + letter);
            }
            return key;
        };
    }
    var key = build_key_getter(keymap);
    function word_to_strokes(word) {
        return word.toUpperCase().split('').map(key).filter(function (_) { return !!_; });
    }
    function count_elements(list) {
        var map = {};
        list.map(function (_) { return _.toUpperCase(); }).forEach(function (element) { return map[element] = (map[element] || 0) + 1; });
        return map;
    }
    var valid_chars = [];
    for (var key_1 in keymap) {
        if (keymap.hasOwnProperty(key_1)) {
            valid_chars.push(key_1);
        }
    }
    var RegExpConstructor = (function () {
        function RegExpConstructor() {
        }
        return RegExpConstructor;
    }());
    RegExp.quote = function (str) {
        return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    };
    var argv = process.argv.slice(2);
    ///@global process
    // console.log(analyze.rate_keystroke_sequence(word_to_strokes('function')));
    argv.forEach(function (arg) {
        fs.readFile(arg, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            data = data.replace(/(\r\n)+/gm, ' ');
            data = data.replace(/\n+/gm, ' ');
            data = data.replace(new RegExp('(?![' + RegExp.quote(valid_chars.join('')) + '])+', 'i'), ' ');
            var words = data.split(' ');
            var counts = count_elements(words);
            var result = {};
            for (var element in counts) {
                if (counts.hasOwnProperty(element)) {
                    result[element] = {
                        word: element,
                        score: analyze.rate_keystroke_sequence_basic(word_to_strokes(element)),
                        count: counts[element]
                    };
                }
            }
            console.log(result);
        });
    });
});
//# sourceMappingURL=test_basic.js.map