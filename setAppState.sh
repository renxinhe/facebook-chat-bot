#!/bin/sh
echo "Please put in your Facebook credential"
node saveAppState.js
export APP_STATE=$(cat appstate.json)
rm -f appstate.json
echo "Your Facebook session JSON has been saved to \$APP_STATE"