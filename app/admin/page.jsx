import { createMetadata } from "../../lib/seo";
import AdminClientPage from "./AdminClientPage";

export const metadata = createMetadata({
  title: "Admin Dashboard | Fresherr.in",
  description: "Administrative console for managing Fresherr job postings and crawlers.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <AdminClientPage />;
}
