import { LogoutButtons } from "./components/logout-buttons";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { getSessionAction } from "@/actions/auth";

export default async function LogoutPage() {
  const session = await getSessionAction()

  if (!session?.data) {
    return redirect(redirects.auth.login)
  }

  return <LogoutButtons />
}
