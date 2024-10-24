# #!/bin/bash
echo "registry=https://registry.npmjs.org/" > .npmrc
echo "@collinlucke:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${secrets.GIT_REGISTRY_TOKEN}" >> .npmrc
