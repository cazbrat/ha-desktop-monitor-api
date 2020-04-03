FROM node:13-alpine
WORKDIR /opt/monitor-api
COPY src/ .
RUN npm install
CMD [ "npm", "start" ]