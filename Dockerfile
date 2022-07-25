ARG UBUNTU_VERSION=focal
FROM ubuntu:${UBUNTU_VERSION}
ARG UBUNTU_VERSION

LABEL org.opencontainers.image.authors="Andrey Gulitsky <andrey@gultisky.dev>"
LABEL org.opencontainers.image.source="https://github.com/gulitsky/solidity-starter"

# Prerequisites
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq \
  && apt-get install -qq --no-install-recommends apt-transport-https apt-utils build-essential ca-certificates curl gpg git jq python-is-python3 < /dev/null > /dev/null \
  && rm -rf /var/lib/apt/lists/*

# Node.js
ARG NODE_JS_VERSION=16
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key \
  | gpg --dearmor > /usr/share/keyrings/nodesource.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_JS_VERSION.x $UBUNTU_VERSION main" > /etc/apt/sources.list.d/nodesource.list

# Yarn
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg \
  | gpg --dearmor > /usr/share/keyrings/yarn.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list

RUN apt-get update -qq \
  && apt-get install -qq --no-install-recommends nodejs yarn < /dev/null > /dev/null \
  && rm -rf /var/lib/apt/lists/*

# sv4git
ARG SV4GIT_VERSION=v2.5.0
RUN curl -fsSL https://api.github.com/repos/bvieira/sv4git/releases/tags/$SV4GIT_VERSION \
  | jq -r '.assets[] | select(.browser_download_url | contains("linux")) | .browser_download_url' \
  | xargs curl -fsSL -o /tmp/sv4git.tar.gz \
  && tar -C /usr/local/bin -xzf /tmp/sv4git.tar.gz
