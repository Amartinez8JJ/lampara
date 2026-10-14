#!/bin/bash
# Copia la v3 vigente y la sube a GitHub Pages (https://amartinez8jj.github.io/lampara/)
set -e
cd "$(dirname "$0")"
for f in index.html motion.js motion.css mod-hogar.js mod-hogar.css mod-iglesia.js mod-iglesia.css; do cp "../v3/$f" .; done
touch .nojekyll
git add -A
git diff --cached --quiet && { echo "Sin cambios"; exit 0; }
git commit -q -m "${1:-Actualiza Lámpara v3}"
git push -q
echo "Listo: https://amartinez8jj.github.io/lampara/"
