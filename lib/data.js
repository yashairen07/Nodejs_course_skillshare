// Library for story and editing data

//Dependencies

var fs = require('fs');
var path = require('path');
const helpers = require('./helpers');

var lib = {};

// Base directory of the data
lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function (dir, file, data, callback) {
    // open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // COnvert data to string
            var stringdata = JSON.stringify(data);

            //write to file
            fs.writeFile(fileDescriptor, stringdata, function (err) {
                if (!err) {
                    //close the current file
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error writing to new file');
                        }
                    })
                }
                else {
                    callback('error writing to new file');
                }
            })

        } else {
            callback('Could not create new file it may already exist')
        }
    });
};


//Read the data from the file
lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', function (err, data) {
        if (!err && data) {
            var parseData = helpers.parseJsonToObject(data);
            callback(false, parseData);

        } else {
            callback(err, data)
        }

    });
};

lib.update = function (dir, file, data, callback) {
    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            var stringdata = JSON.stringify(data);

            fs.truncate(fileDescriptor, function (err) {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringdata, function (err) {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                }
                            })
                        } else {
                            callback('error closing file')
                        }
                    })
                }
                else {
                    callback('error truncating file');
                }
            })

        } else {
            callback('could not open the file for updating');
        }
    })
};


lib.delete = function (dir, file, callback) {
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
        if (!err) {
            callback(false);
        }
        else {
            callback('error deleting file');
        }
    });
};


// List all the items in a directory

lib.list = function (dir, callback) {
    fs.readdir(lib.baseDir + dir + '/', function (err, data) {
        if (!err && data && data.length > 0) {
            var trimmedFileNames = [];
            data.forEach(function (fileName) {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    });
};



module.exports = lib;