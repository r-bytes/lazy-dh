"use client";

import { verifyEmail } from "@/actions/users/user.actions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
  const [message, setMessage] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (searchParams.token) {
        const user = await db.query.users.findFirst({
          where: eq(users.emailVerificationToken, searchParams.token as string),
        });

        if (!user) {
          setMessage("Ongeldige token");
          return;
        }

        await verifyEmail(searchParams.token as string);
        setMessage(`Email bevestigd voor ${user.email}!`);

        setTimeout(() => {
          router.replace("/auth");
        }, 5000); // Redirect after 5 seconds
      } else {
        setMessage("Geen email verificatie token gevonden. Check je email.");
      }
    };

    verifyAndRedirect();
  }, [searchParams.token, router]);

  return (
    <div className="flex items-center justify-center">
      <h1>{message}</h1>
    </div>
  );
};

export default VerifyEmailPage;
