#!/bin/bash
# Setup authentication for GitHub packages
echo "//npm.pkg.github.com/:_authToken=${GIT_REGISTRY_TOKEN}" >> ~/.npmrc
echo "@collinlucke:registry=https://npm.pkg.github.com" >> ~/.npmrc
