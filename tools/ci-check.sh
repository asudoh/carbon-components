#!/bin/sh

tasks=("lint" "build" "test:unit:ci")
if [[ -n "$RUN_EACH" ]]; then
  tasks[${#tasks[@]}] = "test:unit:each:ci"
fi
if [[ -n "$AAT_TOKEN" ]]; then
  tasks[${#tasks[@]}] = "test:a11y"
fi
./node_modules/.bin/npm-run-all -p ${tasks[@]}
