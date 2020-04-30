#!/bin/sh

docker-compose \
  -f test/docker-compose.yml \
  -f test/docker-compose-ci.yml \
  up \
    --abort-on-container-exit \
    --build \
    --force-recreate \
    --renew-anon-volumes \
    --timeout 0