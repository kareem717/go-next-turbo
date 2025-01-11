import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { getAccountAction, getUserAction } from "@/actions/auth";
import { AuthProvider } from "@/components/providers/auth-provider";

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    const userResponse = await getUserAction();
    user = userResponse?.data
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  if (!user) {
    redirect(redirects.auth.login);
  }

  let account
  try {
    const accountResponse = await getAccountAction();

    account = accountResponse?.data
  } catch (error) {
    console.error('Error fetching account data:', error);
  }

  if (!account) {
    redirect(redirects.auth.createAccount);
  }


  return (
    <AuthProvider user={user} account={account}>
      {children}
    </AuthProvider>
  );
}
