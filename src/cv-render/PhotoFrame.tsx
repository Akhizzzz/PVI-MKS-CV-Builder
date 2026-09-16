interface PhotoFrameProps {
  photoUrl?: string;
  fullName: string;
}

export function PhotoFrame({ photoUrl, fullName }: PhotoFrameProps) {
  return (
    <div className="cv-photo-frame" aria-hidden={photoUrl ? undefined : true}>
      {photoUrl ? (
        <img src={photoUrl} alt={fullName ? `Photograph of ${fullName}` : 'Profile photograph'} />
      ) : (
        <div className="cv-photo-placeholder" />
      )}
    </div>
  );
}
