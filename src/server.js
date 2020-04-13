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
var sensor = require('./lmsensor.js');

function buildResources(callback) {
    var resObject = {};
    sequence
        .then(next => { // SYSTEM (nou%)
            resObject.system = [
                [process.env.HOSTNAME, "hostname", null],
                [nou.os.uptime(), "uptime", "s"],
            ];
            next();
        })
        .then(next => { // CPU (nou)
            nou.cpu.usage()
                .then(usagedata => {
                    resObject.cpu = [
                        [usagedata, "usage", "%"]
                    ];
                    next();
                });
        })
        .then(next => { // LMSENSOR (lmsensor)
            sensor.sensor()
                .then(data => {
                    resObject.lmsensor = [];
                    sensors = JSON.parse(data);
                    Object.keys(sensors).forEach(function (chip) {
                        resObject.lmsensor.push([sensors[chip], chip, null]);
                    });
                    next();
                });
        })
        .then(next => { // MEM (nou%)
            nou.mem.used()
                .then(memdata => {
                    resObject.memory = [
                        [(100 * memdata.usedMemMb / memdata.totalMemMb).toFixed(2), "used", "%"],
                        [(memdata.totalMemMb / 1024).toFixed(2), "total", "Gb"]
                    ];
                    next();
                });
        })
        .then(next => { // DRIVE (nou%)
            nou.drive.used()
                .then(drivedata => {
                    resObject.drive = [
                        [(100 * drivedata.usedGb / drivedata.totalGb).toFixed(2), "used", "%"],
                        [drivedata.totalGb, "total", "Gb"]
                    ];
                    next();
                });
        })
        .then(next => {
            callback(resObject);
            next();
        })
}