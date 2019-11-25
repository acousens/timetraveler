#!/usr/bin/env zsh

# Sync to bucket
gsutil rsync -d -x "^\.|.*md$|.*js$|.*json$" ./ gs://tmtrvlr.com;
gsutil rsync -d -r -x "^\." ./assets gs://tmtrvlr.com/assets

# Set cach control
;gsutil -m setmeta -r -h "Cache-Control:no-cache,max-age=0" gs://tmtrvlr.com
