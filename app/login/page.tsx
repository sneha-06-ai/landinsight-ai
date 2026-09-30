import type { Metadata } from "next";
import LoginPortal from "../../components/login-portal";

export const metadata: Metadata = {
  title: "Sign in | LandInsight AI",
  description: "Secure account access for the LandInsight national evidence platform.",
};

export default function LoginPage() {
  return <LoginPortal />;
}