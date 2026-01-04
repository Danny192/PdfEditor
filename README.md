# 📄 PDF Editor - PWA

Un'applicazione web progressiva (PWA) completa per modificare file PDF direttamente nel browser. Aggiungi testo, firme digitali e immagini ai tuoi documenti PDF in modo semplice e veloce.

## ✨ Funzionalità

### Gestione PDF
- 📤 **Carica PDF**: Trascina e rilascia o seleziona file PDF dal tuo dispositivo
- 🔍 **Rendering HD**: Qualità 2.0x per PDF cristallini
- 📄 **Multi-pagina**: Naviga tra le pagine con facilità
- 🔎 **Zoom**: Da 50% a 300% per dettagli perfetti

### Editing Avanzato
- ✏️ **Testo Personalizzato**:
  - Dimensioni da 12px a 32px
  - Colori personalizzabili
  - Supporto multi-linea
  - Trascinabile e ridimensionabile
- ✍️ **Firme Digitali**:
  - Disegna con il mouse o touch
  - Salva fino a 10 firme per riutilizzarle
  - Colore e spessore personalizzabili
- 🖼️ **Immagini**: Carica e posiziona immagini ovunque
- 🗑️ **Elimina**: Pulsante × diretto su ogni elemento

### PWA & Aggiornamenti
- 📱 **Installabile**: Su desktop e mobile come app nativa
- 🔄 **Auto-update**: Sistema di versioning automatico
- 🔔 **Notifiche**: Avviso quando disponibile nuova versione
- 📴 **Offline**: Funziona senza connessione
- 💾 **Salvataggio Locale**: Firme salvate in localStorage

### Sicurezza & Privacy
- 🔒 **100% Privato**: Tutto avviene nel browser
- 🚫 **Zero Server**: Nessun caricamento di file
- 🔐 **Sicuro**: Header di sicurezza configurati
- 🎨 **Moderno**: Design responsivo e intuitivo

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

### Caricamento PDF
1. **Carica un PDF**: Clicca su "Seleziona PDF" o trascina il file
2. **Naviga**: Usa frecce per cambiare pagina
3. **Zoom**: Click su 🔍+ / 🔍- per ingrandire/ridurre

### Aggiunta Testo
1. Scegli dimensione font e colore dalla toolbar
2. Click su "✏️ Testo"
3. Click sul PDF dove vuoi il testo
4. Scrivi direttamente (il campo è già attivo!)
5. Premi Invio per andare a capo

### Firme Digitali
1. Click su "✍️ Firma"
2. **Usa firma salvata**: Click su una firma esistente (se ne hai)
3. **Nuova firma**:
   - Disegna con mouse/dito
   - Scegli colore e spessore
   - Spunta "Salva" per riutilizzarla
   - Click "✓ Usa Firma"
4. Le firme salvate appaiono in alto nel modal (max 10)
5. Hover su firma salvata → click × per eliminarla

### Editing Elementi
- **Sposta**: Click e trascina l'elemento
- **Ridimensiona**: Trascina i pallini agli angoli
- **Edita testo**: Click sul testo per modificarlo
- **Elimina**: Hover sull'elemento → click sul pulsante ×
- **Elimina (alternativo)**: Seleziona + tasto `Canc`

### Salvataggio
1. Click su "💾 Salva PDF"
2. Il PDF viene scaricato con tutte le modifiche
3. Qualità originale preservata

### Aggiornamenti
- L'app controlla aggiornamenti ogni minuto
- Ricevi notifica 🎉 quando c'è nuova versione
- Click sulla notifica per aggiornare subito

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
