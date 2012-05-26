#!/bin/bash

node fileShare/app.js &
PID[1]=$!
node mongo-connector/app.js &
PID[2]=$!

echo "PRESS ANY KEY TO END"
read

for i in `seq 2`
do
	kill ${PID[i]}
done
