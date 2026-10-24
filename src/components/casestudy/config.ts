/**
 * THE GATE. The questionnaire cannot collect a real response while this is
 * false.
 *
 * The client's brief says the participant information and the handling of
 * responses must be agreed BEFORE the questionnaire opens. That agreement does
 * not exist yet, so submission is switched off here, in one place. While it is
 * false the form still renders and can be read in full, says plainly that the
 * study has not opened, and nothing is sent anywhere.
 *
 * TO OPEN THE STUDY, once the participant information sheet is agreed:
 *   1. apply supabase/migrations/0007_study_responses.sql
 *   2. replace the draft questions in questions.ts with the approved ones and
 *      bump QUESTIONNAIRE_VERSION in api/study-response.ts
 *   3. make the privacy page describe what is collected
 *   4. change this to true
 */
export const STUDY_OPEN: boolean = false;
