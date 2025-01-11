import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { LoginForm } from "./components/login-form";
import { getSessionAction } from "@/actions/auth";

export default async function LoginPage() {
  const session = await getSessionAction()

  if (session?.data) {
    return redirect(redirects.auth.logout)
  }

  return <LoginForm />
}
