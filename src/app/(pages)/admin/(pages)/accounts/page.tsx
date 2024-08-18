"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import withAuth from "@/hoc/withAuth";
import { fetchAllUsers } from "@/lib/db/data";
import { DatabaseUser } from "@/lib/types/user";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import UserManagement from "./user-management";

interface UserManagementPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UserManagementPage = ({ searchParams }: UserManagementPageProps) => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState("#facc15");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const userIdFromProps = searchParams.token as string;

  return (
    <MaxWidthWrapper className="mx-auto flex flex-col md:px-8">
      {isLoading ? (
        <div className="my-32 flex items-center justify-center">
          <BeatLoader color={color} loading={isLoading} size={20} aria-label="Loading Spinner" />
        </div>
      ) : (
        <UserManagement allUsers={users} userId={userIdFromProps} />
      )}
    </MaxWidthWrapper>
  );
};

export default withAuth(UserManagementPage);
