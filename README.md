# 📄 PDF Editor - PWA

Un'applicazione web progressiva (PWA) completa per modificare file PDF direttamente nel browser. Aggiungi testo, firme digitali e immagini ai tuoi documenti PDF in modo semplice e veloce.

## ✨ Funzionalità

- 📤 **Carica PDF**: Trascina e rilascia o seleziona file PDF dal tuo dispositivo
- ✏️ **Aggiungi Testo**: Inserisci testo personalizzato ovunque nel documento
- ✍️ **Firme Digitali**: Disegna la tua firma direttamente nell'app
- 🖼️ **Inserisci Immagini**: Aggiungi immagini ai tuoi PDF
- 💾 **Salva PDF**: Scarica il documento modificato
- 📱 **PWA**: Installabile su desktop e mobile, funziona offline
- 🔒 **Privacy**: Tutto avviene nel browser, nessun caricamento su server
- 🎨 **Interfaccia Moderna**: Design responsivo e intuitivo

## 🚀 Installazione Locale

1. Clona il repository:
```bash
git clone https://github.com/Danny192/PdfEditor.git
cd PdfEditor
```

2. Apri il file `index.html` in un browser moderno oppure usa un server locale:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server
```

3. Accedi a `http://localhost:8000` nel browser

## 📦 Deploy su Netlify

### Deploy Automatico

1. Fai fork di questo repository
2. Accedi a [Netlify](https://www.netlify.com/)
3. Clicca su "New site from Git"
4. Seleziona il tuo repository
5. Netlify rileverà automaticamente le impostazioni da `netlify.toml`
6. Clicca su "Deploy site"

### Deploy Manuale

```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## 🛠️ Tecnologie Utilizzate

- **PDF.js**: Rendering e visualizzazione PDF
- **PDF-Lib**: Modifica e salvataggio PDF
- **Service Worker**: Funzionalità offline
- **Canvas API**: Disegno firma digitale
- **Manifest.json**: Configurazione PWA
- **Vanilla JavaScript**: Nessun framework, solo JS puro

## 📱 Installazione come PWA

### Desktop (Chrome/Edge)
1. Visita l'app nel browser
2. Clicca sull'icona di installazione nella barra degli indirizzi
3. Conferma l'installazione

### Mobile (Android/iOS)
1. Apri l'app nel browser
2. Tocca il menu (⋮ o condividi)
3. Seleziona "Aggiungi a schermata Home"

## 🎯 Come Usare

1. **Carica un PDF**: Clicca su "Seleziona PDF" o trascina il file
2. **Aggiungi Elementi**:
   - Click su "Testo" e poi sul PDF per aggiungere testo
   - Click su "Firma" per disegnare una firma
   - Click su "Immagine" per caricare un'immagine
3. **Modifica Elementi**:
   - Trascina per spostare
   - Usa i punti di ridimensionamento per cambiare dimensioni
   - Click per selezionare, tasto Canc per eliminare
4. **Naviga**: Usa i pulsanti per cambiare pagina e zoom
5. **Salva**: Click su "Salva PDF" per scaricare il documento modificato

## 🔒 Privacy e Sicurezza

- ✅ Tutto il processing avviene nel browser
- ✅ Nessun file viene caricato su server esterni
- ✅ I tuoi documenti rimangono privati
- ✅ Nessun tracciamento o analytics

## 🌐 Browser Supportati

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 Licenza

MIT License - Vedi [LICENSE](LICENSE) per dettagli

## 🤝 Contribuire

I contributi sono benvenuti! Sentiti libero di:
1. Fare fork del progetto
2. Creare un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committare le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Aprire una Pull Request

## 📧 Contatti

Per domande o suggerimenti, apri una issue su GitHub.

## 🎉 Crediti

Sviluppato con ❤️ usando tecnologie web moderne.

---

**Nota**: Per generare le icone PWA, apri il file `generate-icons.html` nel browser e scarica tutte le icone nella cartella `/icons/`.
