import { Routes, Route } from "react-router-dom";
import { PostList } from "./PostList";
import { PostEditor } from "./PostEditor";
import { StrandList, StrandEditor } from "./Strands";

/* The Journal section of the site editor, mounted by the shell at
   /admin/journal/*. Posts first; the strands (categories) live under
   /admin/journal/strands. */
export function JournalPanel() {
  return (
    <Routes>
      <Route index element={<PostList />} />
      <Route path="new" element={<PostEditor />} />
      <Route path="strands" element={<StrandList />} />
      <Route path="strands/new" element={<StrandEditor />} />
      <Route path="strands/:id" element={<StrandEditor />} />
      <Route path=":id" element={<PostEditor />} />
    </Routes>
  );
}
