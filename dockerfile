FROM arm32v7/node:8.16.1-alpine 

# add necessary usb libraries
RUN apk add --update --quiet libusb libusb-dev eudev-dev git
# add build environment (will be deleted later)
RUN apk add --no-cache --virtual .gyp python2 make g++ linux-headers

# install blink1-server npm version
RUN npm config set user root
RUN npm install --silent -g node-blink1-server

# git repo version
#RUN git clone https://github.com/todbot/node-blink1-server.git
#RUN cd node-blink1-server && npm install

# cleanup
RUN apk del --quiet .gyp git && rm -rf /var/cache/apk

EXPOSE 8080

# for git repo version
#ENTRYPOINT ["npm", "--prefix", "/node-blink1-server", "start", "8080"]

# for npm version
ENTRYPOINT ["blink1-server", "8080"]
