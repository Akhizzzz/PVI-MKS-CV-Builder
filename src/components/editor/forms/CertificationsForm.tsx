import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { CV, CertificationEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIEnhanceButton } from '../../shared/AIEnhanceButton';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

function CertificationFields({ item, updateItem }: { item: CertificationEntry; updateItem: (patch: Partial<CertificationEntry>) => void }) {
  const ai = useAIEnhance();
  const [previousDescription, setPreviousDescription] = useState<string | null>(null);

  const handleEnhance = async () => {
    setPreviousDescription(item.description ?? '');
    const result = await ai.run('CERTIFICATION', {
      certification_name: item.name,
      institution: item.institute,
      certification_year: item.year,
      current_text: item.description ?? '',
    });
    if (result?.ok && 'bullets' in result) {
      updateItem({ description: result.bullets.join(' ') });
    }
  };

  return (
    <>
      <label className="form-field">
        <span className="form-field-label">Certification / Course Name</span>
        <input
          type="text"
          value={item.name}
          placeholder={PLACEHOLDERS.certificationName}
          onChange={(e) => updateItem({ name: e.target.value })}
        />
      </label>
      <div className="form-row">
        <label className="form-field">
          <span className="form-field-label">Institute / Organisation</span>
          <input
            type="text"
            value={item.institute}
            placeholder={PLACEHOLDERS.certificationInstitute}
            onChange={(e) => updateItem({ institute: e.target.value })}
          />
        </label>
        <label className="form-field">
          <span className="form-field-label">Year</span>
          <input
            type="text"
            value={item.year}
            placeholder={PLACEHOLDERS.year}
            onChange={(e) => updateItem({ year: e.target.value })}
          />
        </label>
      </div>
      <label className="form-field">
        <span className="form-field-label">Tell us what you learned</span>
        <p className="form-field-sublabel">Write briefly about what you learned, practised or created during this course.</p>
        <textarea
          value={item.description ?? ''}
          placeholder={PLACEHOLDERS.certificationDescription}
          rows={2}
          maxLength={1500}
          onChange={(e) => updateItem({ description: e.target.value })}
        />
      </label>

      <AIEnhanceButton
        label="✨ Make Professional"
        onClick={handleEnhance}
        status={ai.status}
        errorMessage={ai.errorMessage}
        onConsentContinue={ai.confirmConsent}
        onConsentCancel={ai.cancelConsent}
        disabled={!(item.description ?? '').trim()}
      />

      {previousDescription !== null && previousDescription !== (item.description ?? '') ? (
        <button
          type="button"
          className="undo-ai-link"
          onClick={() => {
            updateItem({ description: previousDescription });
            setPreviousDescription(null);
          }}
        >
          Undo AI
        </button>
      ) : null}
    </>
  );
}

export function CertificationsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Certifications</h2>
      <p className="form-step-hint">Add any courses or certifications you've completed. Skip this if none apply.</p>

      <RepeatableList<CertificationEntry>
        items={cv.certifications}
        onChange={(certifications) => update({ certifications })}
        createItem={() => ({ id: uuid(), name: '', institute: '', year: '' })}
        addLabel="Add Certification"
        itemNoun="certification"
        emptyHint="No certifications added yet."
        renderItem={(item, _index, updateItem) => <CertificationFields item={item} updateItem={updateItem} />}
      />
    </div>
  );
}
