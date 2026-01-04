#!/usr/bin/env python3
"""
Script per creare icone PNG semplici senza dipendenze esterne.
Crea icone colorate con gradiente base per la PWA.
"""

import struct
import zlib
import os

def create_png(width, height, filename):
    """Crea un semplice PNG con gradiente"""

    # Header PNG
    png_header = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_chunk = create_chunk(b'IHDR', ihdr_data)

    # Crea i dati dell'immagine con un gradiente viola
    image_data = bytearray()
    for y in range(height):
        image_data.append(0)  # Filter type
        for x in range(width):
            # Gradiente da viola a blu
            r = int(102 + (118 - 102) * y / height)
            g = int(126 + (75 - 126) * y / height)
            b = int(234 + (162 - 234) * y / height)

            # Aggiungi rettangolo bianco al centro (documento PDF)
            if (width // 4 <= x <= 3 * width // 4 and
                height // 5 <= y <= 4 * height // 5):
                r, g, b = 255, 255, 255

                # Aggiungi testo "PDF" approssimativo al centro
                center_x, center_y = width // 2, height // 2
                text_region = (
                    abs(x - center_x) < width // 8 and
                    abs(y - center_y) < height // 10
                )
                if text_region:
                    # Forme semplici per "PDF"
                    if abs(x - center_x) < 2 or abs(y - center_y) < 2:
                        r, g, b = 76, 175, 80  # Verde

            image_data.extend([r, g, b])

    # Comprimi i dati dell'immagine
    compressed_data = zlib.compress(bytes(image_data), 9)

    # IDAT chunk
    idat_chunk = create_chunk(b'IDAT', compressed_data)

    # IEND chunk
    iend_chunk = create_chunk(b'IEND', b'')

    # Scrivi il file PNG
    with open(filename, 'wb') as f:
        f.write(png_header)
        f.write(ihdr_chunk)
        f.write(idat_chunk)
        f.write(iend_chunk)

def create_chunk(chunk_type, data):
    """Crea un chunk PNG"""
    length = struct.pack('>I', len(data))
    crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
    return length + chunk_type + data + crc

# Crea la directory icons se non esiste
os.makedirs('icons', exist_ok=True)

# Dimensioni delle icone
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

print("Generazione icone PNG in corso...")
for size in sizes:
    filename = f'icons/icon-{size}x{size}.png'
    create_png(size, size, filename)
    print(f'✓ Creata {filename}')

print('\n✨ Tutte le icone sono state generate con successo!')
print('Le icone sono pronte per la PWA.')
