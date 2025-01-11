"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@repo/ui/components/card";
import { redirects } from "@/lib/config/redirects";
import { useToast } from "@repo/ui/hooks/use-toast";

export function LogoutButtons({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast()

  async function handleLogout() {
    setIsLoading(true);

    const sb = createClient();
    const { error } = await sb.auth.signOut();

    if (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return setIsLoading(false);
    } else {
      router.push(redirects.auth.login);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Are you sure?</CardTitle>
          <CardDescription>
            Logout from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <Button className="w-full" variant="secondary" onClick={handleLogout} disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Logout
            </Button>
            <Button className="w-full" variant="default" onClick={() => router.back()} disabled={isLoading}>
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
};
