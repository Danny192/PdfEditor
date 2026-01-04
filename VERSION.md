# Sistema di Versioning

## Versione Corrente: 1.2.0

### Come Funziona l'Aggiornamento Automatico

L'applicazione utilizza un sistema di versioning integrato con il Service Worker che:

1. **Controlla aggiornamenti ogni 60 secondi**
2. **Notifica l'utente quando c'è una nuova versione**
3. **Permette l'aggiornamento con un semplice click**

### Per gli Sviluppatori

#### Come Aggiornare la Versione

1. Apri il file `/sw.js`
2. Trova la riga: `const VERSION = '1.2.0';`
3. Incrementa il numero di versione seguendo [Semantic Versioning](https://semver.org/):
   - **MAJOR**: Cambiamenti incompatibili (es. 2.0.0)
   - **MINOR**: Nuove funzionalità retrocompatibili (es. 1.3.0)
   - **PATCH**: Bug fix retrocompatibili (es. 1.2.1)

4. Fai commit e push delle modifiche
5. Dopo il deploy su Netlify, gli utenti riceveranno automaticamente la notifica

#### Esempio

```javascript
// Prima
const VERSION = '1.2.0';

// Dopo (nuova funzionalità)
const VERSION = '1.3.0';
```

### Changelog

#### v1.2.0 (2026-01-04)
- ✨ Aggiunto sistema di versioning automatico
- ✨ Notifica aggiornamenti in-app
- ✨ Salvataggio firme digitali in localStorage
- ✨ Riutilizzo firme salvate (max 10)
- 🎨 Interfaccia migliorata per gestione firme
- ⚡ Controllo aggiornamenti ogni 60 secondi

#### v1.1.0 (2026-01-04)
- ✨ Controlli dimensione font e colore testo
- ✨ Supporto testo multi-linea con textarea
- ✨ Pulsante cancellazione diretto su ogni elemento
- 🎨 Rendering PDF migliorato (scala 2.0x)
- 🎨 Migliore feedback visivo elementi
- 🐛 Fix salvataggio colori personalizzati

#### v1.0.0 (2026-01-04)
- 🎉 Release iniziale
- ✨ Caricamento e visualizzazione PDF
- ✨ Aggiunta testo personalizzato
- ✨ Firma digitale con canvas
- ✨ Inserimento immagini
- ✨ Salvataggio PDF modificato
- 📱 PWA completa con offline support
- 🔒 Privacy-first (nessun server)

### Note Tecniche

#### Cache Strategy

Il Service Worker implementa una strategia "Cache First":
- File statici vengono serviti dalla cache
- Fallback alla rete se non in cache
- Cache viene aggiornata automaticamente con nuove versioni

#### Storage

- **Service Worker Cache**: File statici dell'app
- **localStorage**: Firme digitali salvate (max 10)
- Limite totale storage: ~5-10MB (varia per browser)

#### Compatibilità

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### FAQ

**Q: Come forzo un aggiornamento manuale?**
A: Premi `Ctrl+Shift+R` (o `Cmd+Shift+R` su Mac) per fare un hard reload.

**Q: L'utente deve fare qualcosa per ricevere gli aggiornamenti?**
A: No, il sistema controlla automaticamente ogni minuto. L'utente vedrà solo una notifica e potrà cliccare per aggiornare.

**Q: Gli aggiornamenti funzionano offline?**
A: Gli aggiornamenti richiedono connessione. Una volta scaricati, l'app funziona offline.

**Q: Cosa succede alle firme salvate dopo un aggiornamento?**
A: Le firme in localStorage persistono attraverso gli aggiornamenti.
