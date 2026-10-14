# Attraverso Maddaloni - Editor di Layout Nativo 🏛️

**Progetto di Tesi di Laurea Triennale in Design della Comunicazione Visiva**
Accademia di Belle Arti di Napoli (ABANA) - A.A. 2026

* **Studente / Sviluppatore**: Domenico Mataluna
* **Relatrice**: Prof.ssa Paola Tuccillo
* **Co-relatore**: Alessandro Tartaglia

## Descrizione del Progetto 🚀
L'Editor di Layout Nativo è una Web-App proprietaria, leggera (~170KB) e *dependency-free* (scritta interamente in **Vanilla HTML/CSS/JS** senza framework esterni), ideata per garantire l'armonia, la continuità visiva e il controllo centralizzato del branding istituzionale. 

Attraverso un'interfaccia grafica responsiva di alto livello (ispirata ai design pattern di iOS con modali *Glassmorphism* su mobile), l'utente può generare locandine editoriali e materiali social perfetti al pixel, pronti per la stampa (A4 a 300 PPI) o per il web (Instagram a 96 PPI).

## Funzionalità Architetturali Chiave 🛠️
1. **Rendering Vettoriale SVG in tempo reale**: I contenuti inseriti vengono mappati in un sistema di coordinate matematico per prevenire collisioni e mantenere la gerarchia visiva (regola dei terzi).
2. **Sistema Anti-Collisione**: Algoritmo proprietario che individua la sovrapposizione tra Loghi Personali e Watermark Istituzionali, calcolando un *Auto-Gap* dinamico.
3. **Responsive Mobile-First (Bottom Sheets)**: Transizione fluida da una UI desktop a colonna a un'esperienza mobile basata su Modali sovrapposte e navbar touch.
4. **Resilienza e Sicurezza**: Auto-downscaling dei file caricati (per evitare crash di memoria/browser) e sanificazione del testo immesso (prevenzione XSS).
5. **Esportazione Nativa DPI-Aware**: Scaricamento diretto in JPEG ad altissima qualità direttamente dal browser, senza passaggi server-side, rispettando le dimensioni di stampa/pixel fisici del Canvas.

## Tutela Legale ⚖️
**Questo software NON è Open Source per uso commerciale.**
L'utilizzo dell'applicativo è concesso in licenza gratuita. Tuttavia, l'intero codice sorgente, l'interfaccia utente, i meccanismi algoritmici e la brand identity (incluso il font *Mataluna*) sono di proprietà esclusiva di Domenico Mataluna.

Per le limitazioni esatte d'uso (es. divieto di rivendita, clonazione o utilizzo del codice in AI), si prega di fare rigoroso riferimento al file `LICENSE.txt` allegato in questa directory.

---
*© 2026 Domenico Mataluna. Tutti i diritti riservati.*
