import { Routes, Route } from "react-router-dom";
import { PeopleList } from "./PeopleList";
import { PersonForm } from "./PersonForm";

/* Team and advisers. Mounted by the shell at /admin/people/*: the list, a
   blank form at /new, and one person's form at /:id. */
export function PeoplePanel() {
  return (
    <Routes>
      <Route index element={<PeopleList />} />
      <Route path="new" element={<PersonForm />} />
      <Route path=":id" element={<PersonForm />} />
    </Routes>
  );
}
