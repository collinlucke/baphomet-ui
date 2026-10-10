#!/bin/bash

# package.json already depends on the published 0.0.x range.
# Reinstalling still links ../athameui when that folder exists.
echo "athameui stays on the published 0.0.x range."
echo "pnpm install links ../athameui only when that folder is present."
pnpm install
