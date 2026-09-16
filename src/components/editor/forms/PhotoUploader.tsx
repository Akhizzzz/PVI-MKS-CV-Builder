import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { CV } from '../../../data/cvModel';
import { indexedDbStorage } from '../../../storage/indexedDbStorage';
import { usePhotoUrl } from '../../../hooks/usePhotoUrl';
import { PhotoCropModal } from './PhotoCropModal';
import { readFileAsDataUrl } from './cropImage';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface Props {
  cv: CV;
  updatePersonalDetails: (patch: Partial<CV['personalDetails']>) => void;
}

export function PhotoUploader({ cv, updatePersonalDetails }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const currentPhotoUrl = usePhotoUrl(cv.personalDetails.photo?.blobId);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please choose a JPEG, PNG, or WebP image file.');
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setPendingImageSrc(dataUrl);
  };

  const handleCropConfirm = async (blob: Blob) => {
    const previousBlobId = cv.personalDetails.photo?.blobId;
    const blobId = uuid();
    await indexedDbStorage.savePhoto(blobId, blob);
    if (previousBlobId) await indexedDbStorage.deletePhoto(previousBlobId);

    updatePersonalDetails({
      photo: { blobId, cropRect: { x: 0, y: 0, width: 1, height: 1, zoom: 1 } },
    });
    setPendingImageSrc(null);
  };

  const handleRemove = async () => {
    const blobId = cv.personalDetails.photo?.blobId;
    if (blobId) await indexedDbStorage.deletePhoto(blobId);
    updatePersonalDetails({ photo: undefined });
  };

  return (
    <div className="photo-uploader">
      <span className="form-field-label">Profile Photograph</span>

      <div
        className={`photo-dropzone${isDragging ? ' photo-dropzone-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {currentPhotoUrl ? (
          <img src={currentPhotoUrl} alt="Your uploaded photograph" className="photo-dropzone-preview" />
        ) : (
          <p className="photo-dropzone-hint">Drag and drop a photo here, or use the button below.</p>
        )}

        <div className="photo-dropzone-actions">
          <button type="button" className="button-secondary" onClick={() => fileInputRef.current?.click()}>
            Choose Photo
          </button>
          {currentPhotoUrl ? (
            <button type="button" className="button-secondary" onClick={handleRemove}>
              Remove Photo
            </button>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="visually-hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error ? (
        <p className="form-field-error" role="alert">
          {error}
        </p>
      ) : null}

      {pendingImageSrc ? (
        <PhotoCropModal
          imageSrc={pendingImageSrc}
          onCancel={() => setPendingImageSrc(null)}
          onConfirm={handleCropConfirm}
        />
      ) : null}
    </div>
  );
}
