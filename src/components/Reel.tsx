'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { applications } from '@/lib/applications';
import { cn, pill } from '@/lib/ui';
import { useUI } from './UIProvider';

/** Full-screen reel: plays /reel.mp4 if it exists, otherwise a slideshow of the app images. */
export function Reel() {
  const { reelOpen, setReelOpen } = useUI();
  const [hasVideo, setHasVideo] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [slide, setSlide] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Open / close: detect the video once, manage focus.
  useEffect(() => {
    if (reelOpen) {
      opener.current = document.activeElement as HTMLElement | null;
      setPlaying(true);
      close.current?.focus();
      if (hasVideo === null) {
        fetch('/reel.mp4', { method: 'HEAD' })
          .then((r) => setHasVideo(r.ok && (r.headers.get('content-type') ?? '').startsWith('video')))
          .catch(() => setHasVideo(false));
      }
    } else {
      opener.current?.focus();
    }
  }, [reelOpen, hasVideo]);

  // Slideshow timer / video playback.
  useEffect(() => {
    const active = reelOpen && playing;
    if (hasVideo) {
      if (active) void video.current?.play();
      else video.current?.pause();
      return;
    }
    if (!active) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % applications.length), 2800);
    return () => clearInterval(id);
  }, [reelOpen, playing, hasVideo]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Drava reel"
      inert={!reelOpen}
      className={cn(
        'fixed inset-0 z-120 bg-black text-white',
        reelOpen ? 'visible opacity-100 [transition:opacity_.5s]' : 'invisible opacity-0 [transition:opacity_.5s,visibility_0s_.5s]'
      )}
    >
      <div className="absolute inset-0">
        {hasVideo ? (
          <video ref={video} src="/reel.mp4" muted={muted} loop playsInline className="absolute inset-0 size-full object-cover" />
        ) : (
          hasVideo === false &&
          applications.map((app, i) => (
            <Image
              key={app.id}
              src={app.image}
              alt={app.name}
              fill
              quality={90}
              sizes="100vw"
              // contain, not cover: the screenshots are smaller than a full screen, so cropping would blow them up
              className={cn(
                'object-contain p-gutter pb-28 [transition:opacity_1s,transform_3.5s_linear]',
                i === slide ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'
              )}
            />
          ))
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 bg-linear-to-b from-transparent to-black/65 px-gutter py-8">
        <span className="tag text-white/75">[ Drava reel ]</span>
        <div className="flex gap-2">
          <button type="button" className={pill('light')} onClick={() => setPlaying(!playing)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          {hasVideo && (
            <button type="button" className={pill('light')} onClick={() => setMuted(!muted)}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          )}
          <button ref={close} type="button" className={pill('light')} onClick={() => setReelOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReelButton() {
  const { setReelOpen } = useUI();
  return (
    <button type="button" className={pill()} onClick={() => setReelOpen(true)}>
      <span aria-hidden="true" className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-current" />
      Play reel
    </button>
  );
}
