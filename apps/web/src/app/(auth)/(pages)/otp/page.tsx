import { VerifyOTPForm } from "./components/verify-otp-form";
import { getSessionAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import {
  createSearchParamsCache,
  createParser
} from 'nuqs/server'
import { z } from "zod";

const parseAsEmail = createParser({
  parse(queryValue) {
    const isValid = z.string().email().safeParse(queryValue).success
    if (!isValid) return null
    return queryValue
  },
  serialize(value) {
    return value
  }
})

const searchParamsCache = createSearchParamsCache({
  email: parseAsEmail,
});

export default async function OTPPage({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const session = await getSessionAction()

  if (session?.data) {
    return redirect(redirects.auth.logout)
  }

  const { email } = await searchParamsCache.parse(searchParams)

  if (!email) {
    throw new Error("Invalid email")
  }

  return <VerifyOTPForm email={email} />
}
