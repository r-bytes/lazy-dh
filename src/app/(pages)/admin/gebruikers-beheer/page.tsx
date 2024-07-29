import React from "react";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import UserManagement from "../user-management";

interface UserManagementPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UserManagementPage = ({ searchParams }: UserManagementPageProps) => {
  return (
    <MaxWidthWrapper className="mx-auto min-h-screen">
      <UserManagement userIdFromProps={searchParams.token as string} />
    </MaxWidthWrapper>
  );
};

export default UserManagementPage;