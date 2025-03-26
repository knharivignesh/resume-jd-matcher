# /bin/bash

cd resume-adorer-main

docker build -t npm-base .

rm -rf ./node_modules ./dist

docker run --network host --rm -v $(pwd):/app:z npm-base ./build.sh

docker build -t knharivignesh/hackathon:resumeui -f ./DockerfileUI .

rm -rf ./node_modules ./dist

cd ..

cd py_api

docker build -t knharivignesh/hackathon:flask-app .
