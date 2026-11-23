"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  bio: string[];
};

export type TeamGroup = {
  eyebrow: string;
  title: string;
  members: TeamMember[];
};

export default function TeamProfiles({ groups }: { groups: TeamGroup[] }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCleaningUpRef = useRef(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<{
    src: string;
    name: string;
  } | null>(null);
  const [isPhotoClosing, setIsPhotoClosing] = useState(false);
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const photoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPhotoCleaningUpRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedMember || !dialog) return;

    dialog.showModal();
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (dialog.open) {
        isCleaningUpRef.current = true;
        dialog.close();
        isCleaningUpRef.current = false;
      }
    };
  }, [selectedMember]);

  useEffect(() => {
    const dialog = photoDialogRef.current;
    if (!enlargedPhoto || !dialog) return;

    dialog.showModal();
    const rootOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      if (photoCloseTimerRef.current) clearTimeout(photoCloseTimerRef.current);
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
      if (dialog.open) {
        isPhotoCleaningUpRef.current = true;
        dialog.close();
        isPhotoCleaningUpRef.current = false;
      }
    };
  }, [enlargedPhoto]);

  function closeDialog() {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      dialogRef.current?.close();
    }, 180);
  }

  function closePhotoDialog() {
    if (isPhotoClosing) return;
    setIsPhotoClosing(true);
    photoCloseTimerRef.current = setTimeout(() => {
      photoDialogRef.current?.close();
    }, 180);
  }

  return (
    <>
      {groups.map((group, index) => (
        <section className="editorial-row" key={group.eyebrow}>
          <span className="editorial-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <span className="section-kicker">{group.eyebrow}</span>
            <h2>{group.title}</h2>
            <div className="team-profile-grid">
              {group.members.map((member) => (
                <article className="team-profile" key={member.name}>
                  {member.photo ? (
                    <button
                      className="team-profile-image-button"
                      type="button"
                      aria-label={`Enlarge photo of ${member.name}`}
                      onClick={() => {
                        if (!member.photo) return;
                        setIsPhotoClosing(false);
                        setEnlargedPhoto({
                          src: member.photo,
                          name: member.name,
                        });
                      }}
                    >
                      <Image
                        className="team-profile-photo"
                        src={member.photo}
                        alt=""
                        width={96}
                        height={96}
                      />
                    </button>
                  ) : (
                    <div className="team-profile-initials" aria-hidden="true">
                      {member.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                  )}
                  <div className="team-profile-content">
                    <h3>{member.name}</h3>
                    <span className="team-profile-role">{member.role}</span>
                    <p className="team-profile-preview">{member.bio[0]}</p>
                    <button
                      className="team-profile-more"
                      type="button"
                      onClick={() => {
                        setIsClosing(false);
                        setSelectedMember(member);
                      }}
                    >
                      Read full bio <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <dialog
        className={`team-dialog${isClosing ? " is-closing" : ""}`}
        ref={dialogRef}
        aria-labelledby="team-dialog-name"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => {
          if (isCleaningUpRef.current) return;
          setSelectedMember(null);
          setIsClosing(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        {selectedMember && (
          <div className="team-dialog-panel">
            <button
              className="team-dialog-close"
              type="button"
              aria-label="Close biography"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="team-dialog-heading">
              {selectedMember.photo ? (
                <Image
                  className="team-dialog-photo"
                  src={selectedMember.photo}
                  alt=""
                  width={112}
                  height={112}
                />
              ) : (
                <div className="team-dialog-initials" aria-hidden="true">
                  {selectedMember.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}
              <div>
                <span className="section-kicker">PALMS AFRICAN</span>
                <h2 id="team-dialog-name">{selectedMember.name}</h2>
                <span className="team-profile-role">{selectedMember.role}</span>
              </div>
            </div>
            <div className="team-dialog-bio">
              {selectedMember.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </dialog>

      <dialog
        className={`team-photo-dialog${isPhotoClosing ? " is-closing" : ""}`}
        ref={photoDialogRef}
        aria-label={enlargedPhoto ? `Photo of ${enlargedPhoto.name}` : undefined}
        onCancel={(event) => {
          event.preventDefault();
          closePhotoDialog();
        }}
        onClose={() => {
          if (isPhotoCleaningUpRef.current) return;
          setEnlargedPhoto(null);
          setIsPhotoClosing(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePhotoDialog();
        }}
      >
        {enlargedPhoto && (
          <>
            <button
              className="team-dialog-close team-photo-dialog-close"
              type="button"
              aria-label="Close enlarged photo"
              onClick={closePhotoDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="team-photo-stage">
              <Image
                className="team-photo-expanded"
                src={enlargedPhoto.src}
                alt={`Enlarged photo of ${enlargedPhoto.name}`}
                fill
                sizes="94vw"
                priority
              />
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
