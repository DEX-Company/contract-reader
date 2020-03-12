FROM node:10-alpine
MAINTAINER <ilyabukalov@gmail.com>

WORKDIR /work

RUN npm install web3
RUN npm install fast-csv
RUN npm install yargs

COPY dist/main.js /work/main.js

CMD node ./main.js
