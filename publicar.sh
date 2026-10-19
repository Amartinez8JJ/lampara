#!/bin/bash
# Sube Lámpara a GitHub Pages (https://amartinez8jj.github.io/lampara/): v5 en la raíz, v4 en /v4/ y v3 en /v3/
set -e
cd "$(dirname "$0")"
copia() { # copia() carpeta-origen carpeta-destino : solo la app (html, js, css), sin respaldos
  mkdir -p "$2"
  for f in "../$1"/*.js "../$1"/*.css "../$1"/index.html; do [ -e "$f" ] && cp "$f" "$2/"; done
}
for f in *.js *.css; do [ -e "$f" ] && rm "$f"; done
copia v5 .
copia v4 v4
mkdir -p v3; for f in index.html motion.js motion.css mod-hogar.js mod-hogar.css mod-iglesia.js mod-iglesia.css; do cp "../v3/$f" v3/; done
touch .nojekyll
git add -A
git diff --cached --quiet && { echo "Sin cambios"; exit 0; }
git commit -q -m "${1:-Actualiza Lámpara}"
git push -q
echo "Listo: https://amartinez8jj.github.io/lampara/  (v4 en /v4/, v3 en /v3/)"
