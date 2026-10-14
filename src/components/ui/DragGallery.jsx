import { useRef, useState } from 'react'
import './DragGallery.css'

/**
 * DragGallery — galleria orizzontale drag-to-scroll, niente frecce.
 * Le immagini si tagliano ai bordi del contenitore.
 *
 * Props:
 *   items: Array<{ src?: string, label?: string, ratio?: string }>
 *   Quando src è undefined mostra un img-block placeholder.
 */
export default function DragGallery({ items = [] }) {
  const trackRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  function onMouseDown(e) {
    setIsDragging(true)
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
    trackRef.current.style.cursor = 'grabbing'
  }

  function onMouseUp() {
    setIsDragging(false)
    if (trackRef.current) trackRef.current.style.cursor = 'grab'
  }

  function onMouseMove(e) {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.4
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }

  // Touch
  function onTouchStart(e) {
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
  }

  function onTouchMove(e) {
    const x = e.touches[0].pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.4
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <div
      className="drag-gallery"
      ref={trackRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      {items.map((item, i) => (
        <div key={i} className="drag-gallery__item">
          {item.src ? (
            <img
              src={item.src}
              alt={item.label || ''}
              draggable={false}
              className="drag-gallery__img"
            />
          ) : (
            <div
              className="drag-gallery__placeholder"
              style={{ aspectRatio: item.ratio || '4/3' }}
            >
              <span className="drag-gallery__placeholder-label">
                {item.label || 'Immagine in arrivo'}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
