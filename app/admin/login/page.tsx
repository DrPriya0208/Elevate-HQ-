import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { emailCodeAvailable } from "@/lib/twoFactor";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="speckle flex min-h-screen items-center justify-center bg-navy px-6 py-12">
      <div className="w-full max-w-sm rounded-lg bg-mist p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image src="/elevatehq-logo-dark-playfair-1024.png" alt="" width={72} height={72} />
          <h1 className="mt-4 font-serif text-2xl">Admin sign in</h1>
        </div>
        <div className="mt-8">
          <LoginForm emailCodes={emailCodeAvailable()} />
        </div>
      </div>
    </div>
  );
}
