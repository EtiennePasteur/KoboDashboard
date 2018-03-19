#!/bin/bash

sleep 5
pushd /home/pi/Kobo
chromium-browser --args --disable-web-security --user-data-dir --headless --hide-scrollbars --disable-gpu --screenshot --window-size=1440,1080 file:///home/pi/Kobo/dashboard/index.html
ffmpeg -i screenshot.png -f rawvideo -pix_fmt rgb565 -s 1440x1080 -y img.raw
cp img.raw /var/www/html
popd
