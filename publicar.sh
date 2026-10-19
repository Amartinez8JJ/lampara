#!/bin/bash
# Copia la v4 vigente (raíz) y la v3 (/v3/) y las sube a GitHub Pages (https://amartinez8jj.github.io/lampara/)
set -e
cd "$(dirname "$0")"
for f in index.html styles.css icons.js data.js core.js hoy.js flujo.js oracion.js personas.js planes.js camino.js; do cp "../v4/$f" .; done
mkdir -p v3
for f in index.html motion.js motion.css mod-hogar.js mod-hogar.css mod-iglesia.js mod-iglesia.css; do cp "../v3/$f" v3/; done
touch .nojekyll
git add -A
git diff --cached --quiet && { echo "Sin cambios"; exit 0; }
git commit -q -m "${1:-Actualiza Lámpara}"
git push -q
echo "Listo: https://amartinez8jj.github.io/lampara/  (v3 en /v3/)"
