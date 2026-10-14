// Precision Text wrap based on actual SVG box dimensions
export function measureTextWidth(text, fontFamily, fontSize, featureTag) {
  let svg = document.getElementById('measureSVG');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'measureSVG';
    svg.setAttribute('style', 'position:absolute; width:0; height:0; overflow:hidden; visibility:hidden; pointer-events:none;');
    document.body.appendChild(svg);
  }
  const t = document.createElementNS('http://www.w3.org/2000/svg','text');
  t.setAttribute('x','0'); 
  t.setAttribute('y','0');
  t.setAttribute('font-family', fontFamily);
  t.setAttribute('font-size', String(fontSize));
  
  if (featureTag) {
    t.setAttribute('style', `font-feature-settings:"${featureTag}" 1; -webkit-font-feature-settings:"${featureTag}" 1;`);
  }
  
  t.textContent = text || '';
  svg.appendChild(t);
  const bb = t.getBBox();
  t.remove();
  return bb.width;
}

function wrapToLinesSingleParagraph(text, maxWidth, fontFamily, fontSize, featureTag) {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = '';
  const width = (s) => measureTextWidth(s, fontFamily, fontSize, featureTag);

  const breakLongWord = (word) => {
    const out = []; 
    let cur = '';
    for (const ch of word) {
      const test = cur + ch;
      if (width(test) > maxWidth && cur) { 
        out.push(cur); 
        cur = ch; 
      } else { 
        cur = test; 
      }
    }
    if (cur) out.push(cur);
    return out;
  };

  for (let i = 0; i < words.length; i++) {
    let w = words[i];
    if (width(w) > maxWidth) {
      const chunks = breakLongWord(w);
      words.splice(i, 1, ...chunks);
      w = words[i];
    }
    const test = line ? `${line} ${w}` : w;
    if (width(test) > maxWidth && line) { 
      lines.push(line); 
      line = w; 
    } else { 
      line = test; 
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function wrapWithHardBreaks(text, maxWidth, fontFamily, fontSize, featureTag) {
  if (text == null) return [];
  const chunks = String(text).split(/\r?\n/);
  const out = [];
  for (let i = 0; i < chunks.length; i++) {
    const seg = chunks[i];
    if (seg === '') { 
      out.push(''); 
      continue; 
    }
    out.push(...wrapToLinesSingleParagraph(seg, maxWidth, fontFamily, fontSize, featureTag));
  }
  return out;
}

export function escapeXML(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
