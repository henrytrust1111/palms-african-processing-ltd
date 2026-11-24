"use client";

import Image from "next/image";
import { useRef } from "react";

const alt =
  "Infographic showing Nigeria's smallholder resource gap in agricultural credit, fertiliser, extension training and market access.";

export default function TractionInfographic() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openInfographic() {
    dialogRef.current?.showModal();
  }

  function closeInfographic() {
    dialogRef.current?.close();
  }

  return (
    <>
      <figure className="traction-figure" data-reveal>
        <h3>The gap we are closing</h3>
        <button
          className="traction-zoom-trigger"
          type="button"
          onClick={openInfographic}
          aria-label="Enlarge the smallholder resource gap infographic"
        >
          <Image
            src="/assets/traction-gap-infographic.jpg"
            alt={alt}
            width={1800}
            height={1550}
            sizes="(max-width: 900px) 100vw, 54vw"
          />
          <span aria-hidden="true">Click to enlarge</span>
        </button>
        <figcaption>Nigeria&apos;s smallholder resource gap. Tap or click to enlarge.</figcaption>
      </figure>

      <dialog
        className="traction-image-dialog"
        ref={dialogRef}
        aria-label="Nigeria's smallholder resource gap infographic"
        onClick={(event) => {
          if (event.target === dialogRef.current) closeInfographic();
        }}
      >
        <button
          className="traction-image-close"
          type="button"
          onClick={closeInfographic}
          aria-label="Close enlarged infographic"
        >
          <span aria-hidden="true">{"\u00d7"}</span>
        </button>
        <Image
          src="/assets/traction-gap-infographic.jpg"
          alt={alt}
          width={1800}
          height={1550}
          sizes="92vw"
        />
      </dialog>
    </>
  );
}
