export type AISectionType = 'PROFILE' | 'SKILL' | 'WORK_EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'CERTIFICATION';

export const AI_SECTION_TYPES: AISectionType[] = [
  'PROFILE',
  'SKILL',
  'WORK_EXPERIENCE',
  'PROJECT',
  'EDUCATION',
  'CERTIFICATION',
];

interface FieldLimit {
  /** Whether the field is required for a meaningful request. */
  required?: boolean;
  maxLength: number;
}

interface SectionConfig {
  /** Whitelisted input fields — anything else sent by the client is dropped. */
  fields: Record<string, FieldLimit>;
  maxCompletionTokens: number;
}

// Field length limits are generous for normal CV writing but block anyone
// from pasting an enormous document into a small rough-input box (brief §24).
const SHORT = 200;
const ROUGH_TEXT = 1500;

export const SECTION_CONFIG: Record<AISectionType, SectionConfig> = {
  PROFILE: {
    fields: {
      who_are_you: { maxLength: ROUGH_TEXT },
      good_at: { maxLength: ROUGH_TEXT },
      work_you_enjoy: { maxLength: ROUGH_TEXT },
      field_you_are_aiming_for: { maxLength: ROUGH_TEXT },
    },
    // Generous headroom above what a 2-4 sentence paragraph needs: with
    // Structured Outputs, hitting the token limit mid-generation forces the
    // model to close the JSON early rather than fail, silently truncating
    // the text instead of erroring — so this must never be tight.
    maxCompletionTokens: 400,
  },
  SKILL: {
    fields: {
      technical_or_workplace: { maxLength: 20 },
      current_text: { required: true, maxLength: SHORT },
    },
    maxCompletionTokens: 60,
  },
  WORK_EXPERIENCE: {
    fields: {
      job_title: { maxLength: SHORT },
      organisation: { maxLength: SHORT },
      start_date: { maxLength: 30 },
      end_date: { maxLength: 30 },
      current_text: { required: true, maxLength: ROUGH_TEXT },
    },
    maxCompletionTokens: 500,
  },
  PROJECT: {
    fields: {
      project_title: { maxLength: SHORT },
      organisation: { maxLength: SHORT },
      start_date: { maxLength: 30 },
      end_date: { maxLength: 30 },
      current_text: { required: true, maxLength: ROUGH_TEXT },
    },
    maxCompletionTokens: 500,
  },
  EDUCATION: {
    fields: {
      education_type: { maxLength: 30 },
      qualification: { maxLength: SHORT },
      institution: { maxLength: SHORT },
      start_date: { maxLength: 30 },
      end_date: { maxLength: 30 },
      current_text: { required: true, maxLength: ROUGH_TEXT },
    },
    maxCompletionTokens: 450,
  },
  CERTIFICATION: {
    fields: {
      certification_name: { maxLength: SHORT },
      institution: { maxLength: SHORT },
      certification_year: { maxLength: 20 },
      current_text: { required: true, maxLength: ROUGH_TEXT },
    },
    maxCompletionTokens: 250,
  },
};
