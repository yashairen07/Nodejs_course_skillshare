// THis is the unit test
const helpers = require("../lib/helpers");
var assert = require('assert');
var log = require('./../lib/logs')
var exampledebuggingproblem = require('./../lib/exampledebuggingproblem')

var unit = {};

unit['helpers.getNumber should return number'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(typeof (val), 'number');
    done();
}

// Assert that getnumber will return a number
unit['helpers.getNumber should return 1'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(val, 1);
    done();
}

unit['helpers.getNumber should return 2'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(val, 2);
    done();
}

module.exports = unit;

//LOgs.list should callback an array 

unit['logs should callback an array'] = function (done) {
    log.list(true, function (err, logFileName) {
        assert.equal(err, false);
        assert.ok(logFileName instanceof Array);
        assert.ok(logFileName.length > 1);
    })
}

unit['logs should callback an array.truncate should not throw if the log id does not exist it should callback an error'] = function (done) {
    assert.doesNotThrow(function () {
        log.truncate('I do not exist ', function (err) {
            assert.ok(err);
            done();
        });
    }, TypeError);
}


unit['exampledebuggingproblem should not throw when called'] = function (done) {
    assert.doesNotThrow(function () {
        exampledebuggingproblem.init();
        done();
    }, TypeError);
}