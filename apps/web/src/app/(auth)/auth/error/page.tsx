import { AlertCircle } from "lucide-react";

export default async function AuthErrorPage(props: { searchParams: Promise<{ error?: string | null }> }) {
  const searchParams = await props.searchParams;
  let error;
  if (searchParams.error) {
    // i.e. The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.
    error = searchParams.error.split('+').join(' ');
  } else {
    error = "Something went wrong!";
  }

  return (
    <div className="flex flex-col items-center gap-4 justify-center h-screen w-full px-4">
      <AlertCircle className='w-40 h-40 text-muted-foreground animate-pulse' />
      <h2 className='text-lg font-semibold'>{error} </h2>
    </div>
  )
}