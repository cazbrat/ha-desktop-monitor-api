var express = require("express");
var app = express();
var LISTEN_PORT = process.env.LISTEN_PORT || 9999;
app.listen(LISTEN_PORT, () => {
    console.log("Server running on port " + LISTEN_PORT);
});
app.get("/", (req, res, next) => {
    buildResources(function (responseObject) {
        res.json(responseObject);
    });
});
app.get("/healthcheck", (req, res, next) => {
    res.json(true);
});

var Sequence = exports.Sequence || require('sequence').Sequence, sequence = Sequence.create(), err;
var os = require('os');
var nou = require('node-os-utils');

function buildResources(callback) {
    var resObject = {};
    sequence
        .then(next => { // SYSTEM
            resObject.system = {
                'uptime': os.uptime(),
            };
            next();
        })
        .then(next => { // CPU (nou)
            nou.cpu.usage()
                .then((usagedata) => {
                    resObject.cpu = {
                        'core': os.cpus().length,
                        'loadavg': os.loadavg(),
                        'usage': usagedata,
                        'temp': null
                    };
                    next();
                });
        })
        .then(next => { // DRIVE (nou)
            nou.drive.used()
                .then(drivedata => {
                    resObject.drive = {
                        'total': drivedata.totalGb,
                        'used': drivedata.usedGb
                    };
                    next();
                });
        })
        .then(next => { // MEM
            resObject.mem = {
                'total': os.totalmem(),
                'used': os.totalmem() - os.freemem()
            };
            next();
        })
        .then(next => {
            callback(resObject);
            next();
        })
}