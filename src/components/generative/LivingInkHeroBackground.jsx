import { useEffect, useRef } from 'react'

/**
 * LivingInkHeroBackground
 * Sfondo generativo ad altissima resa.
 * Tutto lo schermo è coperto da una matrice di lettere lente.
 * La scritta "MADDALONI" (macro) emerge variando l'opacità delle lettere.
 * Reagisce interattivamente al passaggio del cursore (effetto repulsione liquida e luminescenza).
 */
export default function LivingInkHeroBackground({
  macroWord = 'MADDALONI',
  microText = 'ATTRAVERSO MADDALONI 2026 ',
  color = '#ffffff',
  baseOpacity = 0.12,
  interactive = true
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let startTime = performance.now()
    let width = 0
    let height = 0
    let dpr = 1

    // Tracciamento cursore
    let mouseX = -9999
    let mouseY = -9999
    let targetMouseX = -9999
    let targetMouseY = -9999
    let isMouseActive = false

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseX = (e.clientX - rect.left) * dpr
      targetMouseY = (e.clientY - rect.top) * dpr
      isMouseActive = true
    }

    const handlePointerLeave = () => {
      isMouseActive = false
      targetMouseX = -9999
      targetMouseY = -9999
    }

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Offscreen mask per rasterizzare il testo macro "MADDALONI"
    const maskCanvas = document.createElement('canvas')
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })

    const render = (time) => {
      const elapsed = time - startTime
      // Rallentato per effetto organico
      const t = elapsed * 0.0003 

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const canvasW = canvas.width
      const canvasH = canvas.height

      // Interpolazione fluida del cursore (lerp)
      if (isMouseActive) {
        mouseX += (targetMouseX - mouseX) * 0.15
        mouseY += (targetMouseY - mouseY) * 0.15
      } else {
        mouseX = -9999
        mouseY = -9999
      }

      // 1. Rigenera maschera macro "MADDALONI"
      const sampleScale = 0.25
      const maskW = Math.max(10, Math.floor(canvasW * sampleScale))
      const maskH = Math.max(10, Math.floor(canvasH * sampleScale))

      if (maskCanvas.width !== maskW || maskCanvas.height !== maskH) {
        maskCanvas.width = maskW
        maskCanvas.height = maskH
      }

      if (maskCtx) {
        maskCtx.clearRect(0, 0, maskW, maskH)
        maskCtx.fillStyle = '#ffffff'
        maskCtx.textAlign = 'center'
        maskCtx.textBaseline = 'middle'

        const targetW = maskW * 0.94
        const targetH = maskH * 0.8
        let macroFontSize = Math.min(targetH, Math.floor(targetW / (macroWord.length * 0.58)))
        macroFontSize = Math.max(24, macroFontSize)

        maskCtx.font = `900 ${Math.floor(macroFontSize)}px 'Tifata Display VF', 'Tifata Display', sans-serif`
        maskCtx.fillText(macroWord, maskW / 2, maskH / 2)
      }

      const imgData = maskCtx ? maskCtx.getImageData(0, 0, maskW, maskH) : null
      const pixels = imgData ? imgData.data : null

      // 3. Disegno sul canvas principale
      ctx.clearRect(0, 0, canvasW, canvasH)

      // Griglia micro-tipografica
      const step = Math.max(14, Math.floor(18 * dpr))
      const microFontSize = Math.max(9, Math.floor(11 * dpr))
      
      ctx.font = `700 ${microFontSize}px 'Basic Sans', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = color

      const microChars = microText.replace(/\s+/g, '•')
      let charIdx = 0
      const interactionRadius = 110 * dpr

      for (let y = step / 2; y < canvasH; y += step) {
        const my = Math.floor((y / canvasH) * maskH)
        
        for (let x = step / 2; x < canvasW; x += step) {
          const mx = Math.floor((x / canvasW) * maskW)

          let isInsideMacro = false
          if (pixels && mx >= 0 && mx < maskW && my >= 0 && my < maskH) {
            const idx = (my * maskW + mx) * 4
            if (pixels[idx + 3] > 60) {
              isInsideMacro = true
            }
          }

          // Movimento fluido generativo
          const driftX = Math.sin(y * 0.005 + t * 1.5) * (step * 0.4)
          const driftY = Math.cos(x * 0.005 + t * 1.2) * (step * 0.4)
          
          // Reazione dinamica al cursore
          let mouseDisplaceX = 0
          let mouseDisplaceY = 0
          let mouseExtraAlpha = 0

          if (isMouseActive) {
            const posX = x + driftX
            const posY = y + driftY
            const dx = posX - mouseX
            const dy = posY - mouseY
            const dist = Math.hypot(dx, dy)

            if (dist < interactionRadius && dist > 0) {
              const force = (1 - dist / interactionRadius)
              // Spostamento fluido centrifugo rispetto al cursore
              const push = force * (24 * dpr)
              mouseDisplaceX = (dx / dist) * push
              mouseDisplaceY = (dy / dist) * push
              // Accensione dell'opacità per le lettere vicine al cursore
              mouseExtraAlpha = force * 0.5
            }
          }

          // Onda generativa per far pulsare l'opacità
          const wave = Math.sin(x * 0.003 + y * 0.002 + t * 2) * 0.5 + 0.5
          
          let finalAlpha = 0
          if (isInsideMacro) {
            finalAlpha = baseOpacity * 4.2 + (wave * baseOpacity * 1.4)
          } else {
            finalAlpha = baseOpacity * 0.35 + (wave * baseOpacity * 0.25)
          }

          // Aggiunta reazione mouse all'opacità
          finalAlpha += mouseExtraAlpha

          // Cambio graduale del carattere
          const charShift = Math.floor(wave * 3 + t)
          const ch = microChars[(charIdx + charShift) % microChars.length]

          if (finalAlpha > 0.01) {
            ctx.globalAlpha = Math.min(1.0, finalAlpha)
            ctx.fillText(ch, x + driftX + mouseDisplaceX, y + driftY + mouseDisplaceY)
          }
          charIdx++
        }
      }

      ctx.globalAlpha = 1.0
      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerleave', handlePointerLeave)
      }
    }
  }, [macroWord, microText, color, baseOpacity, interactive])

  return (
    <canvas
      ref={canvasRef}
      className="living-ink-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
