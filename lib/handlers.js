//request handlers


//dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('../config');
//define handlers
var handlers = {};

/*
*
* HTML Handlers
*/


handlers.index = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Read in a template as a string
        var templateData = {
            'head.title': 'Uptime Monitoring - Mode single',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds when your site goes down, we\'ll send you links to up it',

            'body.class': 'index'
        };

        helpers.getTemplate('index', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html')
                    }
                });
                // Return that template as HTML
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

handlers.accountCreate = function (data, callback) {
    if (data.method == 'get') {
        // Read in a template as a string
        var templateData = {
            'head.title': 'Create a account',
            'head.description': 'Signup is easy and only takes a few seconds',
            'body.class': 'accountCreate'
        };

        helpers.getTemplate('accountCreate', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html')
                    }
                });
                // Return that template as HTML
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}


// Create New Session
handlers.sessionCreate = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Login to your account.',
            'head.description': 'Please enter your phone number and password to access your account.',
            'body.class': 'sessionCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};



// Favicon
handlers.favicon = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Read in the favicon's data
        helpers.getStaticAsset('favicon.ico', function (err, data) {
            if (!err && data) {
                // Callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

// Public assets
handlers.public = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, function (err, data) {
                if (!err && data) {

                    // Determine the content type (default to plain text)
                    var contentType = 'plain';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }

    } else {
        callback(405);
    }
};



/*
*
* JSON API Handlers
*/


handlers.exampleError = function (data, callback) {
    var err = new Error('This is an example error');
    throw (err);
};


handlers.users = function (data, callback) {
    var acceptablemethods = ['post', 'get', 'put', 'delete'];
    if (acceptablemethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);

    } else {
        callback(405);
    }
}

handlers._users = {};

//Required data: firstname, lastname, phone, password, tosAgreement
// optional data: none
handlers._users.post = function (data, callback) {
    var firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;

    var lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;

    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


    if (firstname && lastname && password && phone && tosAgreement) {
        console.log(firstname, lastname, password, phone, tosAgreement);


        // make sure that the user doesnt exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                //hash the password
                var hashpassword = helpers.hash(password);


                if (hashpassword) {
                    // create the user object
                    var userobject = {
                        'firstname ': firstname,
                        'lastname': lastname,
                        'phone': phone,
                        'hashpassword': hashpassword,
                        'tosAgreement': true,
                    };
                    _data.create('users', phone, userobject, function (err) {
                        if (!err) {
                            callback(200);
                        }
                        else {
                            console.log(err);
                            callback(500, { 'error': 'could not create the user ' })
                        }
                    })
                }
                else {
                    callback(500, { 'error': 'could not hash the user password' });
                }
            }
            else {
                callback(400, { 'error': 'a user with taht phone number exist' })
            }
        })
    } else {
        callback(400, { 'error': 'missing required fields' });
    }

}

//required data: phone
//optional data : none
handlers._users.get = function (data, callback) {
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //console.log(data, data.payload.phone, phone);

    if (phone) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        delete data.hashedpassword;
                        callback(200, data);
                    }
                    else {
                        callback(404)
                    }
                })
            }
            else {
                callback(403, { "Error": "Missing required token in header, or token is invalid." })
            }
        });
    }
    else {
        callback(
            400, { 'error': 'missing required field' }
        );
    }
}

// required phone
//optional everything else atleast one of them shiuld be specified
handlers._users.put = function (data, callback) {
    // check for the required field
    var firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;

    var lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;

    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;


    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {

            // Get token from headers
            var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            // Verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
                if (tokenIsValid) {

                    // Lookup the user
                    _data.read('users', phone, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields if necessary
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, { 'Error': 'Could not update the user.' });
                                }
                            });
                        } else {
                            callback(400, { 'Error': 'Specified user does not exist.' });
                        }
                    });
                } else {
                    callback(403, { "Error": "Missing required token in header, or token is invalid." });
                }
            });
        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'error': 'missing required field' });
    }


}

//required field : phone 
// @TODO only let an authenticated user delete
handlers._users.delete = function (data, callback) {
    // check that the phone number is valid
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    console.log(data, data.payload.phone, phone);

    if (phone) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, function (err, userData) {
                    if (!err && userData) {
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                // Delete each of the checks associated with the users
                                var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                var checkstodelete = userChecks.length;
                                if (checkstodelete > 0) {
                                    var checkdeleted = 0;
                                    var deletionErrors = false;
                                    // Loop throught the checks
                                    userChecks.forEach(function (checkId) {
                                        _data.delete('checks', checkId, function (err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checkdeleted++;
                                            if (checkdeleted == checkstodelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { 'error': 'error encountered while attempting to delete' });
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    callback(200)
                                }
                            } else {
                                callback(500, { 'Error': 'Could not delete the specified user' });
                            }
                        });
                    } else {
                        callback(400, { 'Error': 'Could not find the specified user.' });
                    }
                });
            } else {
                callback(403, { "Error": "Missing required token in header, or token is invalid." });
            }
        });
    }
    else {
        callback(
            400, { 'error': 'missing required field' }
        );
    }
}

handlers.tokens = function (data, callback) {
    var acceptablemethods = ['post', 'get', 'put', 'delete'];
    if (acceptablemethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);

    } else {
        callback(405);
    }
}


handlers._tokens = {};


handlers._tokens.post = function (data, callback) {
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                // Hash the sent password, and compare it to the password stored in the user object
                var hashPassword = helpers.hash(password);
                console.log(hashPassword, userData.hashpassword);
                if (hashPassword == userData.hashpassword) {
                    // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { 'Error': 'Could not create the new token' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Password did not match the specified user\'s stored password' });
                }
            } else {
                callback(400, { 'Error': 'Could not find the specified user.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field(s).' })
    }
};



// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field, or field invalid' })
    }
};


// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
    var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    console.log(id, extend);

    if (id && extend) {
        // Lookup the existing token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new updates
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not update the token\'s expiration.' });
                        }
                    });
                } else {
                    callback(400, { "Error": "The token has already expired, and cannot be extended." });
                }
            } else {
                callback(400, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { "Error": "Missing required field(s) or field(s) are invalid." });
    }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // Delete the token
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified token' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find the specified token.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};



// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
    // Lookup the token
    _data.read('tokens', id, function (err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};


handlers.checks = function (data, callback) {
    var acceptablemethods = ['post', 'get', 'put', 'delete'];
    if (acceptablemethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);

    } else {
        callback(405);
    }
}


handlers._checks = {};


// Checks - post
// Required data: protocol (https//https) ,url,method,successCodes,timeoutSeconds(if the url takes more than x number of secs we'll consider it down)

// Optional data: none
handlers._checks.post = function (data, callback) {
    // Validate inputs
    var protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;

    var url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;

    var method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;

    var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;

    var timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    console.log(protocol, url, method, successCodes, timeoutSeconds);

    if (protocol && url && method && successCodes && timeoutSeconds) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user phone by reading the token
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                var userPhone = tokenData.phone;

                // Lookup the user data
                _data.read('users', userPhone, function (err, userData) {
                    if (!err && userData) {
                        var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // Verify that user has less than the number of max-checks per user
                        if (userChecks.length < config.maxChecks) {
                            // Create random id for check
                            var checkId = helpers.createRandomString(20);

                            // Create check object including userPhone
                            var checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            };

                            // Save the object
                            _data.create('checks', checkId, checkObject, function (err) {
                                if (!err) {
                                    // Add check id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // Save the new user data
                                    _data.update('users', userPhone, userData, function (err) {
                                        if (!err) {
                                            // Return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, { 'Error': 'Could not update the user with the new check.' });
                                        }
                                    });
                                } else {
                                    callback(500, { 'Error': 'Could not create the new check' });
                                }
                            });



                        } else {
                            callback(400, { 'Error': 'The user already has the maximum number of checks (' + config.maxChecks + ').' })
                        }


                    } else {
                        callback(403);
                    }
                });


            } else {
                callback(403);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required inputs, or inputs are invalid' });
    }
};


// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                // Get the token that sent the request
                var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                // Verify that the given token is valid and belongs to the user who created the check
                console.log("This is check data", checkData);
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        // Return check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field, or field invalid' })
    }
};

// Checks - put
// Required data: id
// Optional data: protocol,url,method,successCodes,timeoutSeconds (one must be sent)
handlers._checks.put = function (data, callback) {
    // Check for required field
    var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // Check for optional fields
    var protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    // Error if id is invalid
    if (id) {
        // Error if nothing is sent to update
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the check
            _data.read('checks', id, function (err, checkData) {
                if (!err && checkData) {
                    // Get the token that sent the request
                    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                    // Verify that the given token is valid and belongs to the user who created the check
                    handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                        if (tokenIsValid) {
                            // Update check data where necessary
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            // Store the new updates
                            _data.update('checks', id, checkData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, { 'Error': 'Could not update the check.' });
                                }
                            });
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Check ID did not exist.' });
                }
            });
        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field.' });
    }
};


// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                // Get the token that sent the request
                var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                // Verify that the given token is valid and belongs to the user who created the check
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {

                        // Delete the check data
                        _data.delete('checks', id, function (err) {
                            if (!err) {
                                // Lookup the user's object to get all their checks
                                _data.read('users', checkData.userPhone, function (err, userData) {
                                    if (!err) {
                                        var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        // Remove the deleted check from their list of checks
                                        var checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            // Re-save the user's data
                                            userData.checks = userChecks;
                                            _data.update('users', checkData.userPhone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { 'Error': 'Could not update the user.' });
                                                }
                                            });
                                        } else {
                                            callback(500, { "Error": "Could not find the check on the user's object, so could not remove it." });
                                        }
                                    } else {
                                        callback(500, { "Error": "Could not find the user who created the check, so could not remove the check from the list of checks on their user object." });
                                    }
                                });
                            } else {
                                callback(500, { "Error": "Could not delete the check data." })
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, { "Error": "The check ID specified could not be found" });
            }
        });
    } else {
        callback(400, { "Error": "Missing valid id" });
    }
};


































// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// Not-Found handler
handlers.notFound = function (data, callback) {
    callback(404);
};


module.exports = handlers;