# build phase
FROM ghcr.io/nodecg/nodecg:2 AS build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
USER root
RUN apt-get update \
	&& apt-get install -y trash-cli
COPY . /tpc3stream
WORKDIR /tpc3stream
RUN npm ci && npm run build

# mount phase
FROM ghcr.io/nodecg/nodecg:2 AS nodecg
WORKDIR /opt/nodecg
USER nodecg
COPY --chown=nodecg:nodecg --from=build /tpc3stream /opt/nodecg/bundles/tpc3stream
CMD ["node", "/opt/nodecg/index.js"]
