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
        "system": { "state": null, "attributes": null },
        "cpu": { "state": null, "attributes": null },
        "memory": { "state": null, "attributes": null },
        "drive": { "state": null, "attributes": null },
    };
    sequence
        .then(next => { // SYSTEM (nou%)
            resObject.system.state = [nou.os.hostname(), "Hostname", null];
            resObject.system.attributes = [
                [nou.os.uptime(), "Uptime", "s"],
            ];
            next();
        })
        .then(next => { // CPU (nou)
            nou.cpu.usage()
                .then(usagedata => {
                    resObject.cpu.state = [usagedata, "Usage", "%"];
                    resObject.cpu.attributes = [
                        [os.cpus().length, "Core", "core"],
                        [os.arch(), "Arch", null],
                        [os.loadavg(), "Load averange", "threat"],
                        [null, "Temperature", "°C"]
                    ];
                    next();
                });
        })
        .then(next => { // MEM (nou%)
            nou.mem.used()
                .then(memdata => {
                    resObject.memory.state = [(100 * memdata.usedMemMb / memdata.totalMemMb).toFixed(2), "Used", "%"];
                    resObject.memory.attributes = [
                        [memdata.totalMemMb, "Total", "Mb"],
                        [memdata.usedMemMb, "Used", "Mb"],
                    ];
                    next();
                });
        })
        .then(next => { // DRIVE (nou%)
            nou.drive.used()
                .then(drivedata => {
                    resObject.drive.state = [(100 * drivedata.usedGb / drivedata.totalGb).toFixed(2), "Used", "%"];
                    resObject.attributes = [
                        [drivedata.totalGb, "Total", "Gb"],
                        [drivedata.usedGb, "Used", "Gb"],
                    ];
                    next();
                });
        })
        .then(next => {
            callback(resObject);
            next();
        })
}