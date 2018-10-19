#!/bin/sh

set -e

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  tar -xjf /tmp/firefox-latest-esr.tar.bz2 --directory /tmp
  export PATH="/tmp/firefox:$PATH"
  export CHROME_BIN=google-chrome
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
elif [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  export TEST_BROWSER=Safari
elif [[ "$TRAVIS_OS_NAME" == "windows" ]]; then
  export TEST_BROWSER=Edge
fi
