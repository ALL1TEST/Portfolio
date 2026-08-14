#!/bin/bash
while true; do
  cd /home/z/my-project
  node /home/z/my-project/node_modules/.bin/next dev --port 3000 -H 0.0.0.0 >> /home/z/my-project/dev.log 2>&1
  echo "[$(date)] Server exited, restarting in 2s..." >> /home/z/my-project/dev.log
  sleep 2
done
