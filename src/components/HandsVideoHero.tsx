'use client';

import { useEffect, useRef } from 'react';

/**
 * HandsVideoHero:
 * Embeds the exact user video animation into the first landing page:
 * - Plays smoothly on loop, muted, playsInline, autoPlay.
 * - Perfectly positioned across the full first page width.
 * - Layered with subtle contrast and feathering to seamlessly blend with the Drava theme.
 */
export function HandsVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure playback starts smoothly
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center"
    >
      {/* Background container scaled to cover hero */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/hands_hero_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover sm:object-contain object-center pointer-events-none select-none contrast-[1.08] brightness-[1.02] mix-blend-darken opacity-95 transition-opacity duration-1000"
        />

        {/* Ambient subtle vignette overlay to blend edges into Drava #f2f2ee paper tone */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(242,242,238,0.7)_85%,#f2f2ee_100%)]" />
        
        {/* Top and bottom subtle feather masks */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#f2f2ee] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#f2f2ee] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

