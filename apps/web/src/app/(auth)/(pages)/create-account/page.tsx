import { getAccountAction, getUserAction } from "@/actions/auth";
import { CreateAccountForm } from "./components/create-account-form";
import { redirects } from "@/lib/config/redirects";
import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const userResult = await getUserAction()

  if (!userResult?.data) {
    return redirect(redirects.auth.login)
  }

  const result = await getAccountAction()

  if (result?.data) {
    return redirect(redirects.dashboard.index)
  }

  const username = userResult.data.user_metadata?.username ?? ""

  return <CreateAccountForm defaultUsername={username} />
}
