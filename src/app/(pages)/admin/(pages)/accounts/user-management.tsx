"use client";
import { sendAdminApprovalMail } from "@/actions/users/user.actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { DatabaseUser } from "@/lib/types/user";
import { EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchUsersNeedApproval } from "@/lib/db/data";

interface UserManagementProps {
  allUsers: DatabaseUser[];
  userIdFromProps: string;
  userId: string;
}

const UserManagement = ({ allUsers, userIdFromProps, userId }: UserManagementProps) => {
  const [users, setUsers] = useState<DatabaseUser[]>(allUsers);
  const [loading, setLoading] = useState(false);
  const [editedUsers, setEditedUsers] = useState<Record<string, boolean>>({});
  const [showApproved, setShowApproved] = useState(false);

  useEffect(() => {
    const initialStatus = allUsers.reduce<Record<string, boolean>>((acc, user) => {
      acc[user.id] = user.admin_approved ?? false;
      return acc;
    }, {});
    setEditedUsers(initialStatus);
  }, [allUsers]);

  const toggleApproval = async (userId: string) => {
    const currentApproval = !editedUsers[userId];
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${userId}`, {
        cache: "no-store",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminApproved: currentApproval }),
      });

      const data = await res.json();

      if (data.success) {
        setEditedUsers((prev) => ({ ...prev, [userId]: currentApproval }));
        toast.success(currentApproval ? "Gebruiker goedgekeurd" : "Goedkeuring ingetrokken");
        if (currentApproval) {
          await sendAdminApprovalMail(userId);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Fout bij het bijwerken van de status");
      console.error("Error updating user status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (showApproved) {
        setLoading(true);
        const usersNeedApproval = await fetchUsersNeedApproval();
        setUsers(usersNeedApproval);
        setLoading(false);
      } else {
        setUsers(allUsers);
      }
    };

    fetchUsers();
  }, [showApproved, allUsers]);

  return (
    <>
      <Title name="Gebruikers Beheer" />
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={() => setShowApproved((prev) => !prev)}>
          {showApproved ? <EyeOff /> : <EyeIcon />}
        </Button>
      </div>
      {loading ? (
        <p className="flex items-center justify-center">Gebruikers laden...</p>
      ) : (
        <Table className="w-full min-w-fit">
          <TableHeader>
            <TableRow className="min-w-fit">
              <TableCell className="min-w-fit">Naam</TableCell>
              <TableCell className="min-w-fit">Email</TableCell>
              <TableCell className="min-w-fit">Adres</TableCell>
              <TableCell className="min-w-fit">Postcode</TableCell>
              <TableCell className="min-w-fit">Stad</TableCell>
              <TableCell className="min-w-fit">Tel</TableCell>
              <TableCell className="min-w-fit">Bedrijf</TableCell>
              <TableCell className="min-w-fit">BTW</TableCell>
              <TableCell className="min-w-fit">KVK</TableCell>
              <TableCell className="min-w-fit">Status</TableCell>
              <TableCell className="min-w-fit">Acties</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={user.id === userIdFromProps ? "bg-primary/20" : ""}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.postal}</TableCell>
                <TableCell className="min-w-fit">{user.city}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>{user.vatNumber}</TableCell>
                <TableCell>{user.chamberOfCommerceNumber}</TableCell>
                <TableCell>{editedUsers[user.id] ? "Goedgekeurd" : "Nieuw"}</TableCell>
                <TableCell>
                  <Button onClick={() => toggleApproval(user.id)}>{editedUsers[user.id] ? "Intrekken" : "Goedkeuren"}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default UserManagement;
