---
---
#!/bin/bash

# This script uses plantuml to generate SVG images from inline plantuml descriptions.
# See ./auth/oauth.md for an example.
#
# You need to have plantuml installed (brew install plantuml, or some other method).
#
# Either call directly to generate diagrams for all markdown files in this directory,
# or add a --watch flag to rebuild SVGs on changes.

cd "$( dirname "${BASH_SOURCE[0]}" )"

if [[ "$1" == '--watch' ]]; then
  npx --no-install nodemon --ext md --exec './generate-uml.sh'
fi

grep '@startuml' -rl --include '*.md' . | while read -r file ; do
  echo "Generating : $file"
  plantuml -tsvg "$file" 2> >(grep -v "CoreText note:")
done
