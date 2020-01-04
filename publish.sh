#!/usr/bin/env bash

export DOCKER_TAG="${DOCKER_TAG:-latest}"
echo $DOCKER_TAG
docker tag kopnik-client_nginx_build:latest kopnik/kopnik-client:${DOCKER_TAG}
docker push kopnik/kopnik-client:latest
