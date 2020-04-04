# Home Assistant - Monitoring API

![GitHub](https://img.shields.io/github/license/cazbrat/ha-monitor-api)

Welcome to the lightweight "ha-desktop-monitor" project! 
(a fork of  [`ned-kelly/ha-monitor-api`](https://github.com/ned-kelly/ha-monitor-api) project)

This is a quick  lightweight API designed to expose the system's current metrics of a linux desktop as a simple JSON endpoint that your Home Assistant instance can query.

It's been designed to run in a Docker Container so that you can quickly feed metrics back to Home Assistant and the primary goal of this tool is to expose a simple lightweight API that runs in a docker container exposing monitoring stats in real-time that can be fed into your other systems.

**NOTE:** The following system architectures are currently supported: `amd64`. - If you're running on an architecture other than these the process will not start / you will need to build the docker image yourself.


## Prerequisites

- Docker
- Docker-compose
- Linux OS (amd64) that you wish to monitor

## Standing up

It's pretty straightforward, just clone down the sources and stand up the container like so:

```
git clone https://github.com/cazbrat/ha-desktop-monitor.git
cd ha-desktop-monitor
docker build --tag desktop-monitor .
docker run --publish 9999:9999 --detach --name desktop-monitor  desktop-monitor:latest
```

## Integrating to Home Assistant

Integrating into Home Assistant can be done like any other sensor using the [RESTful Sensor](https://www.home-assistant.io/components/sensor.rest/).

**_Your (sensors/configuration.yaml) file:_**

```yaml
# Sensor to monitor system resources for the Front Door PI.
- platform: rest
  name: Facundo Desktop
  resource: http://10.16.10.144:9999
  timeout: 30
  value_template: '{{ value_json.value}}'
  headers:
    Content-Type: application/json
    User-Agent: Home Assistant Agent

# To use the data on the Home Assistant Lovelace Dashboard we need to extract the values from the sensor, and store them as their own sensor values...
- platform: template
  sensors:
    facundo_desktop_sistem_uptime:
      value_template: '{{ states.sensor.facundo_desktop.attributes["system"]["uptime"] | multiply(0.01666) | round(0) }}'
      unit_of_measurement: 'm'
      entity_id: sensor.facundo_desktop
    facundo_desktop_cpu_core:
      value_template: '{{ states.sensor.facundo_desktop.attributes["cpu"]["core"] }}'
      unit_of_measurement: 'core'
      entity_id: sensor.facundo_desktop
    facundo_desktop_cpu_loadavg_1m:
      value_template: '{{ states.sensor.facundo_desktop.attributes["cpu"]["loadavg"][0] }}'
      unit_of_measurement: 'thread'
      entity_id: sensor.facundo_desktop
    facundo_desktop_cpu_loadavg_5m:
      value_template: '{{ states.sensor.facundo_desktop.attributes["cpu"]["loadavg"][1] }}'
      unit_of_measurement: 'thread'
      entity_id: sensor.facundo_desktop
    facundo_desktop_cpu_loadavg_15m:
      value_template: '{{ states.sensor.facundo_desktop.attributes["cpu"]["loadavg"][2] }}'
      unit_of_measurement: 'thread'
      entity_id: sensor.facundo_desktop
    facundo_desktop_cpu_usage:
      value_template: '{{ states.sensor.facundo_desktop.attributes["cpu"]["usage"] }}'
      unit_of_measurement: '%'
      entity_id: sensor.facundo_desktop
    facundo_desktop_drive_total:
      value_template: '{{ states.sensor.facundo_desktop.attributes["drive"]["total"] }}'
      unit_of_measurement: 'Mb'
      entity_id: sensor.facundo_desktop
    facundo_desktop_drive_used:
      value_template: '{{ states.sensor.facundo_desktop.attributes["drive"]["used"] }}'
      unit_of_measurement: 'Mb'
      entity_id: sensor.facundo_desktop
    facundo_desktop_mem_total:
      value_template: '{{ states.sensor.facundo_desktop.attributes["mem"]["total"] | multiply(0.000976563) | round(0) }}'
      unit_of_measurement: 'kb'
      entity_id: sensor.facundo_desktop
    facundo_desktop_mem_used:
      value_template: '{{ states.sensor.facundo_desktop.attributes["mem"]["used"] | multiply(0.000976563) | round(0) }}'
      unit_of_measurement: 'kb'
      entity_id: sensor.facundo_desktop
```
