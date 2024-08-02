"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { useEffect, useState } from "react";
import { DatabaseUser } from "@/lib/types/user";
import { fetchAllUsers } from "@/lib/db/data";
import UserManagement from "./user-management";
import { Session } from "next-auth";

interface UserManagementPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const UserManagementPage = ({ searchParams }: UserManagementPageProps) => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  const userIdFromProps = searchParams.token as string;

  return users.length > 0 ? (
    <MaxWidthWrapper className="mx-auto flex flex-col">
      <UserManagement allUsers={users} userId={userIdFromProps} />
    </MaxWidthWrapper>
  ) : null;
};

export default UserManagementPage;
