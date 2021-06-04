// Library that demonstrated something throwing when its init is called

//container for the module
var example = {};

example.init = function () {
    var foo = bar;
};

module.exports = example;