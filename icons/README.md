# Icone PWA

Questa cartella contiene le icone per l'applicazione PWA.

## Generazione Icone

Hai diverse opzioni per generare le icone:

### Opzione 1: Usando il Browser (Consigliato)
1. Apri il file `/generate-icons.html` nel browser
2. Scarica tutte le icone generate
3. Salva le icone in questa cartella

### Opzione 2: Usando ImageMagick
Se hai ImageMagick installato, esegui:
```bash
./generate-simple-icons.sh
```

### Opzione 3: Usando Node.js
Se hai Node.js e canvas installati:
```bash
npm install canvas
node create-icons.js
```

### Opzione 4: Manualmente
Crea immagini PNG con le seguenti dimensioni:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Placeholder Corrente

Le icone SVG presenti sono placeholder. Per una PWA completamente funzionale,
genera icone PNG usando uno dei metodi sopra indicati.

## Design Icona

L'icona dovrebbe rappresentare un documento PDF con:
- Sfondo gradiente viola/blu (#667eea to #764ba2)
- Rettangolo bianco che rappresenta un foglio
- Angolo piegato in alto a destra
- Testo "PDF" verde (#4CAF50) al centro
