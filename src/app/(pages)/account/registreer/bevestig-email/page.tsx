import { verifyEmail } from "@/actions/users/user.actions";
import ChangePasswordForm from "@/components/ui/account/reset-password/change-password-form";
import ResetPasswordForm from "@/components/ui/account/reset-password/reset-password-form";
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

    await verifyEmail(searchParams.token as string)

    if (!user) {
      return <div className="flex justify-center items-center h-screen">Invalid token</div>;
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <h1>
          Email bevestigd voor <b>{user.email}</b>!
        </h1>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Verify Email</h1>
        No email verification token found. Check your email.
      </div>
    );
  }
};

export default VerifyEmailPage;
