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
import BeatLoader from "react-spinners/BeatLoader";
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface UserManagementProps {
  allUsers: DatabaseUser[];
  userId: string;
}

const UserManagement = ({ allUsers, userId }: UserManagementProps) => {
  const [users, setUsers] = useState<DatabaseUser[]>(allUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("#facc15");
  const [editedUsers, setEditedUsers] = useState<Record<string, boolean>>({});
  const [showApproved, setShowApproved] = useState(false);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

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

  const confirmDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  const deleteUser = async () => {
    if (!deleteUserId) return;

    setIsDeleting((prev) => ({ ...prev, [deleteUserId]: true })); // Set deleting state for the specific user

    try {
      const res = await fetch(`/api/admin/users/${deleteUserId}`, {
        cache: "no-store",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
        toast.success("Gebruiker succesvol verwijderd");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Fout bij het verwijderen van de gebruiker");
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [deleteUserId]: false })); // Reset deleting state for the specific user
      setDeleteUserId(null); // Reset the deleteUserId state
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
        <div className="my-32">
          <BeatLoader color={color} loading={isLoading} size={20} aria-label="Loading Spinner" />
        </div>
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
                    <Button
                      className="mb-2 w-32 bg-primary/70 font-bold text-black/70 hover:bg-primary dark:text-secondary dark:hover:text-secondary"
                      onClick={() => toggleApproval(user.id)}
                    >
                      {isSaving[user.id] ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : editedUsers[user.id] ? (
                        "Intrekken"
                      ) : (
                        "Goedkeuren"
                      )}
                    </Button>
                    <Button variant="destructive" className="w-32 hover:bg-red-700" onClick={() => confirmDeleteUser(user.id)}>
                      {isDeleting[user.id] ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Verwijderen"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <DialogTrigger />
        <DialogContent className="border-none bg-zinc-800">
          <h2 className="text-lg font-bold text-secondary dark:text-secondary-foreground">Weet je zeker dat je deze gebruiker wil verwijderen?</h2>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-none bg-primary/70 font-bold text-black/70 hover:bg-primary dark:text-secondary dark:hover:text-secondary"
              onClick={() => setDeleteUserId(null)}
            >
              Annuleren
            </Button>
            <Button variant="destructive" className="hover:bg-red-700" onClick={deleteUser}>
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
