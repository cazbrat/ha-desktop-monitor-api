FROM node:13-alpine
WORKDIR /opt/desktop-monitor-api
RUN apk add --update lm-sensors
COPY src/ .
RUN npm install
CMD [ "npm", "start" ]