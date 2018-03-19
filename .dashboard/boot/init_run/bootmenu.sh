zcat /mnt/onboard/.dashboard/boot/images/bootscreen.raw | /usr/local/Kobo/pickel showpic
/usr/local/Kobo/pickel wait-for-hit 0 0 1080 711 0 729 1080 711
SELECT=$?
echo $SELECT > /tmp/bootselect
sync
zcat /mnt/onboard/.dashboard/boot/images/bootscreen_$SELECT.raw | /usr/local/Kobo/pickel showpic 1
