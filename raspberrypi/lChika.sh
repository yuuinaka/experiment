#!/bin/bash
if [ $# -eq 0 ]; then
  num=3
  len=0.5
else
  num=$1
  if [ $# -gt 1 ]; then
    len=$2
  else
    len=0.5
  fi
fi

# Setup the GPIO port for the LED
if [ ! -e /sys/class/gpio/gpio26 ]; then
  sudo echo "26" > /sys/class/gpio/export
fi
cd /sys/class/gpio/gpio26
sudo echo "out" > direction

# Perform L-chika
cnt=0
while [ $cnt -lt $num ]; do
  echo 1 > value
  sleep `expr $len`
  echo 0 > value
  sleep `expr $len`
  cnt=`expr $cnt + 1`
done

# Close the GPIO port
sudo echo 26 > /sys/class/gpio/unexport

