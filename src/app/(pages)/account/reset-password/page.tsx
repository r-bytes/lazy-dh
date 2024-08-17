import ChangePasswordForm from "@/components/ui/account/reset-password/change-password-form";
import ResetPasswordForm from "@/components/ui/account/reset-password/reset-password-form";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  if (searchParams.token) {
    const user = await db.query.users.findFirst({
      where: eq(users.resetPasswordToken, searchParams.token as string),
    });

    if (!user) {
      return <div className="flex items-center justify-center">Invalid token</div>;
    }

    return <ChangePasswordForm resetPasswordToken={searchParams.token as string} />;
  } else {
    return <ResetPasswordForm />;
  }
};

export default ResetPasswordPage;
