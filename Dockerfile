FROM node:13-alpine
WORKDIR /opt/desktop-monitor-api
COPY src/ .
RUN npm install
CMD [ "npm", "start" ]