import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const routeSeoData = {
  '/': {
    title: 'Attraverso Maddaloni — Identità di Carattere | Tesi in Design',
    desc: 'Un progetto di brand urbano nato dall\'incrocio tra la stratificazione storica e la percezione reale dei cittadini di Maddaloni. Tesi di laurea di Domenico Mataluna.',
  },
  '/progetto': {
    title: 'Il Metodo e le 3 Fasi | Attraverso Maddaloni',
    desc: 'Il protocollo in tre fasi: analisi storico-visiva, percezione urbana partecipata e sintesi visiva con carattere tipografico nativo.',
  },
  '/progetto/stemmi': {
    title: 'Stemmi e Ricostruzioni Araldiche | Attraverso Maddaloni',
    desc: 'Analisi delle fonti storiche e delle ricostruzioni araldiche di Ignarra (1939), Imposimato e De Sivo per la città di Maddaloni.',
  },
  '/progetto/sondaggio': {
    title: 'Il Sondaggio Percettivo (346+ Risposte) | Attraverso Maddaloni',
    desc: 'Dashboard interattiva dei dati dell\'indagine percettiva tra i cittadini di Maddaloni: differenziale semantico Osgood e lessico di domani.',
  },
  '/progetto/lezioni': {
    title: 'Le Lezioni con i Ragazzi e Mappa Emozionale | Attraverso Maddaloni',
    desc: 'Risultati del laboratorio con 19 studenti del Convitto Nazionale: mappatura di 22 luoghi urbani tra Socialità, Tensione e Dovere.',
  },
  '/progetto/carattere': {
    title: 'Il Carattere Tifata Variable Font | Attraverso Maddaloni',
    desc: 'Type tester interattivo per il carattere tipografico variabile Tifata, progettato sulle radici calligrafiche ed epigrafiche locali.',
  },
  '/progetto/brand': {
    title: 'L\'Identità Visiva e il Brand System | Attraverso Maddaloni',
    desc: 'Regole visive, palette cromatica e applicazioni del nuovo brand urbano partecipato per Maddaloni.',
  },
  '/risorse': {
    title: 'Risorse e Download Asset | Attraverso Maddaloni',
    desc: 'Download del font Tifata, linee guida visive, griglie di impaginazione e dataset del progetto.',
  },
  '/strumenti': {
    title: 'Strumenti e Generatore Locandine | Attraverso Maddaloni',
    desc: 'Strumento aperto per la creazione di locandine istituzionali e comunicazione pubblica coordinata per Maddaloni.',
  },
}

export default function SEO() {
  const location = useLocation()

  useEffect(() => {
    const current = routeSeoData[location.pathname] || {
      title: 'Attraverso Maddaloni — Identità di Carattere',
      desc: 'Protocollo metodologico di brand urbano e tipografia partecipata per la città di Maddaloni.',
    }

    document.title = current.title

    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', current.desc)
    }

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', current.title)
    }

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
      ogDesc.setAttribute('content', current.desc)
    }

    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://attraversomaddaloni.it${location.pathname}`)
    }
  }, [location])

  return null
}
