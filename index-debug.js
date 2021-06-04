/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampledebuggingproblem = require('./lib/exampledebuggingproblem')
// Declare the app
var app = {};

// Init function
app.init = function () {

    debugger;
    // Start the server
    server.init();
    debugger;

    debugger;
    // Start the workers
    workers.init();
    debugger;

    debugger;
    // Start the CLI, but make sure it starts last
    setTimeout(function () {
        cli.init();
    }, 50);
    debugger;

    debugger;
    var foo = 1;
    console.log("Just assigned 1 to foo")
    debugger;

    debugger;
    foo++;
    console.log("Just added 1 to foo")
    debugger;

    debugger;
    foo = foo * foo;
    console.log("Just squared")
    debugger;


    foo = foo.toString();
    console.log("Just converted")
    debugger;
    //call the init script that will throw
    exampledebuggingproblem.init();
    console.log("Just called the library")
    debugger;
};

// Self executing
app.init();


// Export the app
module.exports = app;