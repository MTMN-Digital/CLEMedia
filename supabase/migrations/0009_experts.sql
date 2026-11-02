-- Experts: specialists involved in the project, each linking to their own
-- site, listed on /team under the advisers (Conor, 2026-11-02).
--
-- A third people.type, and a website column. The site renders `website` as a
-- link, so only http(s) URLs are accepted: a javascript: or data: URL saved
-- here would run on the public page.

alter table public.people drop constraint if exists people_type_check;
alter table public.people
  add constraint people_type_check check (type in ('team', 'advisor', 'expert'));

alter table public.people
  add column if not exists website text
    constraint people_website_http check (website is null or website ~* '^https?://[^\s/$.?#][^\s]*$');
