# /bin/bash

docker build -t npm-base .

rm -rf ./node_modules ./dist

docker run --network host --rm -v $(pwd):/app:z npm-base ./build.sh

docker build -t resume-ui-build -f ./DockerfileUI .