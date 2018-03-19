#!/bin/sh

insmod /drivers/ntx508/wifi/sdio_wifi_pwr.ko
insmod /drivers/ntx508/wifi/dhd.ko

sleep 5

sh /mnt/onboard/.dashboard/wifiup.sh

sleep 10

rm /mnt/onboard/.dashboard/img.raw
wget -q http://192.168.1.106/img.raw -P /mnt/onboard/.dashboard/

zcat /mnt/onboard/.dashboard/img.raw | /usr/local/Kobo/pickel showpic

sh /mnt/onboard/.dashboard/wifidn.sh

rmmod dhd
rmmod sdio_wifi_pwr
sync

sleep 10

timestp=$((`date +%s`/3600))
let timestp+=1
timestp=$((timestp * 3600)) 

/mnt/onboard/.dashboard/busybox_custom rtcwake -a -m mem -t $timestp
