'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { applications } from '@/lib/applications';
import { cn, pill } from '@/lib/ui';
import { useUI } from './UIProvider';

/** Full-screen reel: plays /reel.mp4 if it exists, otherwise a slideshow of the app images. */
export function Reel() {
  const { reelOpen, setReelOpen } = useUI();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [slide, setSlide] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync native dialog with reelOpen state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (reelOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setPlaying(true);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [reelOpen]);

  // Slideshow timer
  useEffect(() => {
    if (!reelOpen || !playing) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % applications.length), 2800);
    return () => clearInterval(id);
  }, [reelOpen, playing]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Drava reel"
      onClose={() => setReelOpen(false)}
      className={cn(
        'fixed inset-0 m-0 p-0 max-w-none max-h-none size-full z-120 bg-black text-white border-none backdrop:bg-black',
        reelOpen ? 'visible opacity-100 [transition:opacity_.5s]' : 'invisible opacity-0 [transition:opacity_.5s,visibility_0s_.5s]'
      )}
    >
      <div className="absolute inset-0">
        {applications.map((app, i) => (
          <Image
            key={app.id}
            src={app.image}
            alt={app.name}
            fill
            quality={90}
            sizes="100vw"
            className={cn(
              'object-contain p-gutter pb-28 [transition:opacity_1s,transform_3.5s_linear]',
              i === slide ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'
            )}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 bg-linear-to-b from-transparent to-black/65 px-gutter py-8">
        <span className="tag text-white/75">[ Drava reel ]</span>
        <div className="flex gap-2">
          <button type="button" className={pill('light')} onClick={() => setPlaying(!playing)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className={pill('light')} onClick={() => setReelOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </dialog>
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
