import { createMetadata } from "../../lib/seo";
import MatchesClientPage from "./MatchesClientPage";

export const metadata = createMetadata({
  title: "My Matches | Fresherr.in",
  description: "Find job and internship matches based on your resume and skills.",
  path: "/matches",
  noIndex: true,
});

export default function MatchesPage() {
  return <MatchesClientPage />;
}
