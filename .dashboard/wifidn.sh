#!/bin/sh 
killall wpa_supplicant 
wlarm_le -i eth0 down 
ifconfig eth0 down
