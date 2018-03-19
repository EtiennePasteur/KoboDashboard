if [ -e /tmp/bootselect ]; then
	SELECTED=$(cat /tmp/bootselect)
	
	if [ $SELECTED == "2" ]; then
		
		sleep 3
		
		killall on-animator.sh	
		killall nickel
		killall sickel
		killall fickel
		killall hindenburg  
		
		/sbin/hwclock -s -u
		
		zcat /mnt/onboard/.dashboard/splash.raw | /usr/local/Kobo/pickel showpic
    
		/mnt/onboard/.dashboard/busybox_custom crond & 
		
		sleep 2
		
		echo "ch 4" > /sys/devices/platform/pmic_light.1/lit
		echo "cur 0" > /sys/devices/platform/pmic_light.1/lit
		echo "dc 0" > /sys/devices/platform/pmic_light.1/lit
		
		sleep 2
		
		sh /mnt/onboard/.dashboard/update.sh &
	fi
fi
