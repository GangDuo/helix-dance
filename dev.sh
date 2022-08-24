#!/bin/bash

cd `dirname $0`

docker-compose run --rm --service-ports app npm run dev
