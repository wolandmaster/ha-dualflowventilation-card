#!/bin/bash

export TAG="ha-dualflowventilation-card"

docker stop $(docker ps | awk "/${TAG}/ {print \$1}")
