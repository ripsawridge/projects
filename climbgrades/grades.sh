#!/bin/bash
# A shell script to wrap the climbgrades utility.
DIRECT=`dirname $0`/climbgrades
node $DIRECT/grades.js $@

