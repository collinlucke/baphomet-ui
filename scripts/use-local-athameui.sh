#!/bin/bash

# Link the sibling athameui checkout without changing package.json.
echo "Linking local athameui..."
node scripts/link-local-athameui.js
echo "Using local athameui. package.json stays on the published 0.0.x range."
