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
            resObject.state = [os.hostname(), "Desktop Monitor", null, "mdi:desktop-classic"];
            resObject.attribute.system = {
                'uptime': [os.uptime(), "Uptime", "s", "mdi:clock-outline"],
            };
            next();
        })
        .then(next => { // CPU (nou)
            nou.cpu.usage()
                .then(usagedata => {
                    var patt64 = /.+64/g;
                    var patt32 = /.+32/g;
                    if (patt64.test(os.arch())) { var icon = "mdi:cpu-64-bit" }
                    else if (patt32.test(os.arch())) { var icon = "mdi:cpu-32-bit" }
                    else { var icon = "mdi:chip" };
                    resObject.attribute.cpu = {
                        'core': [os.cpus().length, "Core", "core", icon],
                        'loadavg': [os.loadavg(), null, "threat", "mdi:buffer"],
                        'usage': [usagedata, "Usage", "%", icon],
                        'temp': [null, "Temperature", "°C", "mdi:thermometer"]
                    };
                    next();
                });
        })
        .then(next => { // DRIVE (nou)
            nou.drive.used()
                .then(drivedata => {
                    resObject.attribute.drive = {
                        'total': [drivedata.totalGb, "Total", "Gb", "mdi:harddisk"],
                        'used': [drivedata.usedGb, "Used", "Gb", "mdi:harddisk"],
                    };
                    next();
                });
        })
        .then(next => { // MEM
            resObject.attribute.mem = {
                'total': [Math.round(os.totalmem() / 1024 / 1024), "Total", "Mb", "mdi:memory"],
                'used': [Math.round((os.totalmem() - os.freemem()) / 1024 / 1024), "Used", "Mb", "mdi:memory"]
            };
            next();
        })
        .then(next => {
            callback(resObject);
            next();
        })
}