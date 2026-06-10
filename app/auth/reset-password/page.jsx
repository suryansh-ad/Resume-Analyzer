import { ResetPasswordPage } from "../../../components/ResetPasswordPage";
import { createMetadata } from "../../../lib/seo";

export const metadata = createMetadata({
  title: "Reset Password - Fresherr",
  description: "Reset your Fresherr account password securely.",
  path: "/auth/reset-password",
});

export default function ResetPasswordRoute() {
  return <ResetPasswordPage />;
}
