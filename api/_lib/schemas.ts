import { z } from 'zod';
import type { AISectionType } from './sectionConfig.js';

const OUTPUT_SECTIONS: AISectionType[] = ['PROFILE', 'SKILL'];

function jsonSchemaFor(sectionType: AISectionType) {
  if (OUTPUT_SECTIONS.includes(sectionType)) {
    return {
      type: 'object',
      properties: {
        section_type: { type: 'string', const: sectionType },
        output: { type: 'string' },
      },
      required: ['section_type', 'output'],
      additionalProperties: false,
    };
  }
  return {
    type: 'object',
    properties: {
      section_type: { type: 'string', const: sectionType },
      bullets: { type: 'array', items: { type: 'string' } },
    },
    required: ['section_type', 'bullets'],
    additionalProperties: false,
  };
}

/** Groq Structured Outputs schema (response_format.json_schema) for a section. */
export function groqSchemaFor(sectionType: AISectionType) {
  return {
    name: 'pvi_cv_section',
    strict: true,
    schema: jsonSchemaFor(sectionType),
  };
}

const outputResultSchema = z.object({
  section_type: z.string(),
  output: z.string().min(1),
});

const bulletsResultSchema = z.object({
  section_type: z.string(),
  bullets: z.array(z.string().min(1)),
});

/** Server-side re-validation of the model's response — never trust
 * `strict: true` alone (the brief explicitly requires this second check). */
export function zodSchemaFor(sectionType: AISectionType) {
  return OUTPUT_SECTIONS.includes(sectionType) ? outputResultSchema : bulletsResultSchema;
}
