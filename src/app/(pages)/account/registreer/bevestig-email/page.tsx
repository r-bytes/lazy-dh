import { verifyEmail } from "@/actions/users/user.actions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  if (searchParams.token) {
    const user = await db.query.users.findFirst({
      where: eq(users.emailVerificationToken, searchParams.token as string),
    });

    await verifyEmail(searchParams.token as string);

    if (!user) {
      return <div className="flex h-screen items-center justify-center">Invalid token</div>;
    }

    return (
      <div className="flex h-screen items-center justify-center">
        <h1>
          Email bevestigd voor <b>{user.email}</b>!
        </h1>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1>Verify Email</h1>
        No email verification token found. Check your email.
      </div>
    );
  }
};

export default VerifyEmailPage;
