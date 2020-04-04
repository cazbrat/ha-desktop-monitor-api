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
    var resObject = {
        "state": null,
        "attributes": {}
    };
    sequence
        .then(next => { // SYSTEM (nou%)
            resObject.state = [nou.os.hostname(), "Desktop Monitor", null, "mdi:desktop-classic"];
            resObject.attributes.system = {
                'uptime': [nou.os.uptime(), "Uptime", "s", "mdi:clock-outline"],
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
                    resObject.attributes.cpu = {
                        'core': [os.cpus().length, "Core", "core", icon],
                        'loadavg': [os.loadavg(), null, "threat", "mdi:buffer"],
                        'usage': [usagedata, "Usage", "%", icon],
                        'temp': [null, "Temperature", "°C", "mdi:thermometer"]
                    };
                    next();
                });
        })
        .then(next => { // DRIVE (nou%)
            nou.drive.used()
                .then(drivedata => {
                    resObject.attributes.drive = {
                        'total': [drivedata.totalGb, "Total", "Gb", "mdi:harddisk"],
                        'used': [drivedata.usedGb, "Used", "Gb", "mdi:harddisk"],
                    };
                    next();
                });
        })
        .then(next => { // MEM (nou%)
            nou.mem.used()
                .then(memdata => {
                    resObject.attributes.mem = {
                        'total': [memdata.totalMemMb, "Total", "Mb", "mdi:memory"],
                        'used': [memdata.usedMemMb, "Used", "Mb", "mdi:memory"],
                    };
                    next();
                });
        })
        .then(next => {
            callback(resObject);
            next();
        })
}