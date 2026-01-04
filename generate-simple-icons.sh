#!/bin/bash
# Script per generare icone PNG da SVG usando ImageMagick
# Se ImageMagick non è disponibile, usa le icone SVG come fallback

SIZES=(72 96 128 144 152 192 384 512)

# Controlla se convert (ImageMagick) è disponibile
if command -v convert &> /dev/null; then
    echo "ImageMagick trovato, generando icone PNG..."
    for size in "${SIZES[@]}"; do
        convert icons/icon-192x192.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
        echo "Creata icon-${size}x${size}.png"
    done
    echo "Tutte le icone PNG generate con successo!"
elif command -v magick &> /dev/null; then
    echo "ImageMagick (magick) trovato, generando icone PNG..."
    for size in "${SIZES[@]}"; do
        magick icons/icon-192x192.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
        echo "Creata icon-${size}x${size}.png"
    done
    echo "Tutte le icone PNG generate con successo!"
else
    echo "ImageMagick non disponibile. Creo icone placeholder..."
    # Crea copie dell'SVG come fallback
    for size in "${SIZES[@]}"; do
        cp icons/icon-192x192.svg icons/icon-${size}x${size}.svg
        echo "Creata icon-${size}x${size}.svg (placeholder)"
    done
    echo "Nota: Per generare PNG, installa ImageMagick e riesegui questo script"
    echo "O apri generate-icons.html nel browser per scaricare manualmente le icone"
fi
