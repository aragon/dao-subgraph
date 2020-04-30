FROM node

RUN apt-get update -qq
RUN apt-get install wait-for-it -y -qq

WORKDIR /usr/src/app

# Context must be the root directory of this repo
COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
COPY test/entrypoint.sh .

CMD ["./entrypoint.sh"]