FROM node:8.9.1-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Set a working directory
WORKDIR /usr/src/app

# Install native dependencies
# RUN set -ex; \
#   apk add --no-cache ...

#RUN apk add --update python python-dev py-pip build-base
#RUN apk add --update git
#RUN apk add --update openssh-client

#COPY keys/* /root/.ssh/
#RUN chown -R root:root /root/.ssh
#RUN chmod -R 0600 /root/.ssh

RUN npm i -g npx

COPY package.json yarn.lock .babelrc ./
RUN yarn config set registry https://registry.npm.taobao.org -g
RUN yarn install --no-cache --frozen-lockfile --production=false

COPY src ./src
COPY tools ./tools
RUN chown -R root:root src tools

RUN npx babel src --out-dir build
CMD [ "node", "build/server_ws.js" ]
