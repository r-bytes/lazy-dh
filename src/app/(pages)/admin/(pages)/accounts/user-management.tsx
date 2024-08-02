"use client";
import { sendAdminApprovalMail } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { DatabaseUser } from "@/lib/types/user";
import { EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface UserManagementProps {
  allUsers: DatabaseUser[];
  userId: string;
}

const UserManagement = ({ allUsers, userId }: UserManagementProps) => {
  const [users, setUsers] = useState<DatabaseUser[]>(allUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [editedUsers, setEditedUsers] = useState<Record<string, boolean>>({});
  const [showApproved, setShowApproved] = useState(false);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialStatus = allUsers.reduce<Record<string, boolean>>((acc, user) => {
      acc[user.id] = user.admin_approved ?? false;
      return acc;
    }, {});
    setEditedUsers(initialStatus);
  }, [allUsers]);

  const toggleApproval = async (userId: string) => {
    const currentApproval = !editedUsers[userId];
    setIsSaving((prev) => ({ ...prev, [userId]: true })); // Set saving state for the specific user

    try {
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
      setIsSaving((prev) => ({ ...prev, [userId]: false })); // Reset saving state for the specific user
    }
  };

  return (
    <>
      <Title name="Accounts beheren" />
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={() => setShowApproved((prev) => !prev)}>
          {showApproved ? <EyeOff /> : <EyeIcon />}
        </Button>
      </div>
      {isLoading ? (
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
            {users
              .filter((user) => !showApproved || !user.admin_approved)
              .map((user) => (
                <TableRow key={user.id} className={user.id === userId ? "bg-primary/20" : ""}>
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
                    <Button className="w-32" onClick={() => toggleApproval(user.id)}>
                      {isSaving[user.id] ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : editedUsers[user.id] ? (
                        "Intrekken"
                      ) : (
                        "Goedkeuren"
                      )}
                    </Button>
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
