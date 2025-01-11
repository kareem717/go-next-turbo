import { redirects } from "@/lib/config/redirects";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Hello, world!
      <Link href={redirects.dashboard.index} prefetch>Dashboard</Link>
    </div>
  );
}

