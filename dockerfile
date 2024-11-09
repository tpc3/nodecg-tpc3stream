FROM ghcr.io/nodecg/nodecg:2
WORKDIR /opt/nodecg
RUN apt-get update && apt-get install make gcc python3 musl-dev g++ trash-cli
USER nodecg
COPY --chown=nodecg:nodecg . /opt/nodecg/bundles/tpc3stream/
WORKDIR /opt/nodecg/bundles/tpc3stream/
RUN npm i && npm run build
USER root
RUN apt-get remove make gcc python3 musl-dev g++ trash-cli
USER nodecg