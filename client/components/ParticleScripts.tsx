'use client';

import { useState } from 'react';
import Script from 'next/script';

export default function ParticleScripts() {
  const [sketchLoaded, setSketchLoaded] = useState(false);

  return (
    <>
      <Script
        src="/particles/sketch.min.js"
        strategy="afterInteractive"
        onLoad={() => setSketchLoaded(true)}
      />
      {sketchLoaded && (
        <Script
          src="/particles/particles.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
