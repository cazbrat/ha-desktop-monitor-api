# Home Assistant - Monitoring API

![GitHub](https://img.shields.io/github/license/cazbrat/ha-desktop-monitor-api)

Welcome to the lightweight "ha-desktop-monitor-api" project! 
(a fork of [`ned-kelly/ha-monitor-api`](https://github.com/ned-kelly/ha-monitor-api) project)

This is a quick lightweight API designed to expose the system's current metrics of a linux desktop. The expose is a simple JSON endpoint that your Home Assistant instance can query.

It's been designed to run in a Docker Container so that you can quickly feed metrics back to Home Assistant and the primary goal of this tool is to expose a simple lightweight API that runs in a docker container exposing monitoring stats in real-time that can be fed into your other systems.

**NOTE:** The following system architectures are currently supported: `x86_64`. - If you're running on an architecture other than these the process will not start / you will need to build the docker image yourself.


## Prerequisites

- Docker
- Linux OS (amd64) that you wish to monitor
- lm-sensors

## Standing up

It's pretty straightforward, just clone down the sources and build and run the container like so:

```
git clone https://github.com/cazbrat/ha-desktop-monitor-api.git
cd ha-desktop-monitor-api
docker build --tag desktop-monitor-api .
docker run --detach --name desktop-monitor-api \
       --restart always \
       --env HOSTNAME=`hostname -f` \
       --publish 9999:9999 \
       desktop-monitor-api:latest
```

## Updating
To update the monitor, just update the image of Docker, rebuild and run! (don't forget remove the old container and image)
```
cd ha-desktop-monitor-api
docker container rm --force desktop-monitor-api
docker image  rm --force desktop-monitor-api
git pull origin master
docker build --tag desktop-monitor-api .
docker run --detach --name desktop-monitor-api \
       --restart always \
       --env HOSTNAME=`hostname -f` \
       --publish 9999:9999 \
       desktop-monitor-api:latest
```

## Integrating to Home Assistant

Integrating into Home Assistant can be done with the ```custom_component``` [ha-desktop-monitor-component](https://github.com/cazbrat) or
like any other sensor using the [RESTful Sensor](https://www.home-assistant.io/components/sensor.rest/).
