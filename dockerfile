FROM node:alpine
WORKDIR /opt/nodecg
RUN apk add --no-cache git make gcc python3 musl-dev g++ && npm install --global nodecg-cli && nodecg setup
COPY . /opt/nodecg/bundles/tpc3stream/
WORKDIR /opt/nodecg/bundles/tpc3stream/
RUN npm i && npm run build && apk del git make gcc python3 musl-dev g++
WORKDIR /opt/nodecg
CMD ["node", "index.js"]