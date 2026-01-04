# 🚀 Guida al Deployment su Netlify

Questa guida ti aiuterà a pubblicare la PWA PDF Editor su Netlify in pochi semplici passi.

## Metodo 1: Deploy Automatico (Consigliato)

### Prerequisiti
- Account GitHub
- Account Netlify (gratuito su [netlify.com](https://www.netlify.com/))

### Passi

1. **Connetti il Repository a Netlify**
   - Vai su [app.netlify.com](https://app.netlify.com/)
   - Clicca su "Add new site" → "Import an existing project"
   - Seleziona "GitHub" come provider
   - Autorizza Netlify ad accedere ai tuoi repository
   - Seleziona il repository `PdfEditor`

2. **Configura il Build**
   - Branch to deploy: `claude/pdf-editor-pwa-fYd8c` (o il branch che preferisci)
   - Build command: (lascia vuoto - già configurato in netlify.toml)
   - Publish directory: (lascia vuoto - già configurato in netlify.toml)
   - Clicca su "Deploy site"

3. **Personalizza il Dominio (Opzionale)**
   - Vai su "Site settings" → "Domain management"
   - Clicca su "Options" → "Edit site name"
   - Scegli un nome personalizzato (es: `mio-pdf-editor`)
   - Il sito sarà disponibile su `https://mio-pdf-editor.netlify.app`

4. **Verifica PWA**
   - Visita il sito deployato
   - Apri Chrome DevTools (F12)
   - Vai su "Application" → "Manifest"
   - Verifica che il manifest sia caricato correttamente
   - Vai su "Service Workers" e verifica che sia registrato

## Metodo 2: Deploy da CLI

### Prerequisiti
- Node.js installato
- Account Netlify

### Passi

1. **Installa Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login a Netlify**
   ```bash
   netlify login
   ```

3. **Deploy il Sito**
   ```bash
   # Deploy di test (draft)
   netlify deploy

   # Seleziona "Create & configure a new site"
   # Quando chiede la publish directory, premi Enter (usa la root)

   # Deploy in produzione
   netlify deploy --prod
   ```

4. **Ottieni l'URL**
   - Netlify ti fornirà un URL unico
   - Copia l'URL e condividilo!

## Metodo 3: Deploy Manuale (Drag & Drop)

1. **Prepara i File**
   - Scarica tutti i file del repository in una cartella locale
   - Assicurati che tutti i file siano presenti (index.html, app.js, styles.css, ecc.)

2. **Deploy su Netlify**
   - Vai su [app.netlify.com/drop](https://app.netlify.com/drop)
   - Trascina la cartella del progetto nell'area di drop
   - Netlify caricherà automaticamente i file
   - Il sito sarà online in pochi secondi!

## Configurazione Avanzata

### Environment Variables
Se necessario, aggiungi variabili d'ambiente:
1. Vai su "Site settings" → "Environment variables"
2. Clicca su "Add a variable"
3. Aggiungi le tue variabili

### Custom Domain
Per usare un dominio personalizzato:
1. Vai su "Domain settings"
2. Clicca su "Add custom domain"
3. Segui le istruzioni per configurare il DNS

### HTTPS
- HTTPS è abilitato automaticamente su Netlify
- Tutti i siti ottengono un certificato SSL gratuito

### Analytics (Opzionale)
- Abilita Netlify Analytics per statistiche avanzate
- Vai su "Analytics" nel dashboard del sito

## Testing PWA

Dopo il deployment, testa la PWA:

1. **Lighthouse Audit**
   ```bash
   # Installa lighthouse
   npm install -g lighthouse

   # Esegui audit
   lighthouse https://tuo-sito.netlify.app --view
   ```

2. **PWA Test Checklist**
   - ✅ Manifest presente e valido
   - ✅ Service Worker registrato
   - ✅ Icons disponibili
   - ✅ Funziona offline
   - ✅ Installabile come app
   - ✅ HTTPS abilitato

3. **Test su Dispositivi Mobili**
   - Apri il sito su smartphone
   - Verifica che compaia il prompt "Aggiungi a schermata Home"
   - Installa l'app
   - Testa la funzionalità offline

## Troubleshooting

### Il Service Worker non si registra
- Verifica che il sito sia servito via HTTPS
- Controlla la console del browser per errori
- Cancella la cache del browser

### Le icone non appaiono
- Verifica che le icone siano nella cartella `/icons/`
- Controlla che il manifest.json abbia i percorsi corretti
- Rigenera le icone con `python3 create-simple-icons.py`

### Errori 404
- Verifica che `netlify.toml` sia presente
- Controlla le regole di redirect nel file

### La PWA non è installabile
- Verifica che tutti i requisiti PWA siano soddisfatti
- Usa Chrome DevTools → Application → Manifest per debug
- Controlla che HTTPS sia abilitato

## Aggiornamenti

Per pubblicare aggiornamenti:

1. **Deploy Automatico**
   - Fai push delle modifiche su GitHub
   - Netlify rebuilderà automaticamente il sito

2. **Deploy CLI**
   ```bash
   netlify deploy --prod
   ```

3. **Deploy Manuale**
   - Trascina di nuovo la cartella aggiornata

## Monitoraggio

### Deploy Log
- Vai su "Deploys" nel dashboard Netlify
- Visualizza i log di build per debug

### Analytics
- Monitora visite, performance e errori
- Configura alert per problemi

## Risorse Utili

- [Netlify Docs](https://docs.netlify.com/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Supporto

Per problemi:
1. Controlla i log di deploy su Netlify
2. Verifica la console del browser
3. Apri una issue su GitHub

---

**Congratulazioni!** 🎉
La tua PWA PDF Editor è ora online e accessibile a tutti!
