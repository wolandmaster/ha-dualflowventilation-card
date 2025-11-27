#!/bin/bash

export TAG="ha-dualflowventilation-card"

docker build --file test/Dockerfile --tag ${TAG} $(pwd)
docker run --interactive --tty --rm --publish 8123:8123 ${TAG}
