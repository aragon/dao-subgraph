FROM node

RUN apt-get update -qq
RUN apt-get install wait-for-it libsecret-1-dev -y -qq
# libsecret-1-dev contains 'keytar' required by @graphprotocol/graph-cli/src/command-helpers/auth.js

WORKDIR /usr/src/app

# Context must be the root directory of this repo
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Despite test/ being overwritten, prefetching node_modules speeds up the build +5s
COPY test/package.json test/
COPY test/yarn.lock test/
RUN cd test && yarn

COPY . ./

WORKDIR /usr/src/app/test
RUN yarn

CMD ["yarn", "test"]