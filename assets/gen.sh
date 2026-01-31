#!/bin/bash

cd "$(dirname "$0")"

# https://github.com/pamburus/termframe

termframe -o add.svg --padding 2 -H auto --title "npx skillman add" -- pnpx skillman add vercel-labs/skills:find-skills anthropics/skills:skill-creator

termframe -o install.svg --padding 2 -H auto --title "npx skillman" -- pnpx skillman
