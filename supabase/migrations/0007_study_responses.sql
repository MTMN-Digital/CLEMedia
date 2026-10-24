-- DO NOT APPLY YET.
--
-- This migration is written for review and is not to be run against any
-- database until the client has agreed the participant information sheet and
-- how responses to the cross-border case study are handled (who may read them,
-- how long they are kept, how a participant asks for theirs to be removed).
-- That agreement is a condition in the client's own brief. Until it exists the
-- questionnaire on /case-study is closed (STUDY_OPEN is false in
-- src/components/casestudy/config.ts) and nothing can reach this table.
--
-- WHAT IS STORED. One row per submitted educator questionnaire. The
-- questions are drafts awaiting the education adviser's approval, so every row
-- records which version of the questionnaire it answered, and a change to the
-- wording means a new version string rather than an edit that quietly changes
-- what old answers mean.
--
-- WHAT IS NOT STORED. No child's name, no child's details, no IP address and
-- no free-text field that asks for either. The form tells the educator not to
-- include them. The one contact field is optional and is only for follow up on
-- this study.
--
-- ACCESS. Row level security is on and there is NO public policy: the browser
-- can neither read nor write this table. Rows are inserted by
-- api/study-response.ts through the service role after server side
-- validation, the same pattern as `orders`. Only an admin can read them, and
-- an admin can delete a row, which is how a participant's removal request is
-- honoured.

create table public.study_responses (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  questionnaire_version text not null,
  route                 text not null check (route in ('ireland','england')),

  -- About the educator and the group. Bands, not exact figures.
  role                  text not null check (role in ('childminder','early_years_educator','teacher','other')),
  setting               text not null check (setting in ('home','centre','school','other')),
  age_band              text not null check (age_band in ('under_3','3_to_4','5_to_6','mixed')),
  group_size            text not null check (group_size in ('1_to_5','6_to_12','13_to_20','over_20')),

  -- What was used. Episode 003 is the study episode; the offline activity may
  -- have been done in full, in part or not at all.
  offline_activity      text not null check (offline_activity in ('full','part','none')),

  -- Agreement with each statement, 1 (strongly disagree) to 5 (strongly agree).
  r_attention           smallint not null check (r_attention  between 1 and 5),
  r_language            smallint not null check (r_language   between 1 and 5),
  r_framework           smallint not null check (r_framework  between 1 and 5),
  r_offline             smallint check (r_offline between 1 and 5),
  r_again               smallint not null check (r_again      between 1 and 5),

  -- Open answers, capped so a bad client cannot store a novel.
  noticed               text check (char_length(noticed) <= 2000),
  change                text check (char_length(change)  <= 2000),

  -- Optional, for follow up on this study only.
  contact_email         text check (char_length(contact_email) <= 320)
);

create index study_responses_created_idx on public.study_responses (created_at desc);

alter table public.study_responses enable row level security;

-- No public policy at all: not readable and not writable by anon. The service
-- role bypasses RLS, which is the only way a row gets in.
create policy "admin read"   on public.study_responses for select using (public.is_admin());
create policy "admin delete" on public.study_responses for delete using (public.is_admin());
