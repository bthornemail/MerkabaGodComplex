#!/bin/bash
export NVM_DIR="$HOME/.nvm"
# Load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Now run your Node app with npm start or whatever you want
cd /home/main/github/singularity2d
npm run dev
