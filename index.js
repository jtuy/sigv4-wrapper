'use strict';

const aws4 = require('aws4');   // https://github.com/mhart/aws4

class AWS4RequestSigner {

    constructor() {
        if (process.env['AWS_ACCESS_KEY_ID'] &&
            process.env['AWS_SECRET_ACCESS_KEY'] &&
            process.env['AWS_SESSION_TOKEN'])
            this.getSignedRequest = (options, body) => {
                if (!options.path)
                    throw "AWS4RequestSigner ERROR: 'path' required";
                if (!options.host && !options.service)
                    throw "AWS4RequestSigner ERROR: 'host' or 'service' required";
                if (body)
                    options.body = body;
                const request = aws4.sign(options,
                {
                    accessKeyId:     process.env['AWS_ACCESS_KEY_ID'],
                    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
                    sessionToken:    process.env['AWS_SESSION_TOKEN']
                });
                delete request.headers['Host'];
                delete request.headers['Content-Length'];
                return request;
            };
        else
            throw JSON.stringify({
                "REQUIRED OS ENVIRONMENT VARIABLES": [
                    "AWS_ACCESS_KEY_ID",
                    "AWS_SECRET_ACCESS_KEY",
                    "AWS_SESSION_TOKEN"
                ]
            }, null, 1);
    }

}

module.exports = {
    AWS4RequestSigner
};