var sensors = {
    sensor: function () {
        const exec = require('child_process').exec;
        return new Promise((resolve, reject) => {
            exec("sensors -jA", (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                resolve(stdout ? stdout : stderr);
            });
        });
    }
}
module.exports = sensors;