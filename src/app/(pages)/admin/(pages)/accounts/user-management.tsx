"use client";
import { sendAdminApprovalMail } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { useAuthContext } from "@/context/AuthContext";
import { DatabaseUser } from "@/lib/types/user";
import { EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserManagementProps {
  allUsers: DatabaseUser[];
  userId: string;
}

const UserManagement = ({ allUsers, userId }: UserManagementProps) => {
  const { authorizedEmails } = useAuthContext();
  const [users, setUsers] = useState<DatabaseUser[]>(allUsers.filter((user) => !authorizedEmails.includes(user.email)));
  const [color, setColor] = useState("#facc15");
  const [editedUsers, setEditedUsers] = useState<Record<string, boolean>>({});
  const [showApproved, setShowApproved] = useState(false);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState<Record<string, boolean>>({});

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

  const sendPasswordReset = async (userId: string) => {
    setIsResettingPassword((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Reset email is verstuurd");
      } else {
        toast.error(data.message || "Fout bij het versturen van reset email");
      }
    } catch (error) {
      toast.error("Fout bij het versturen van reset email");
      console.error("Error sending password reset:", error);
    } finally {
      setIsResettingPassword((prev) => ({ ...prev, [userId]: false }));
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
      <div className="w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableCell className="w-[35%]">Gebruiker</TableCell>
              <TableCell className="w-[25%]">Contact</TableCell>
              <TableCell className="w-[20%]">Bedrijfsinfo</TableCell>
              <TableCell className="w-[10%]">Status</TableCell>
              <TableCell className="w-[10%] text-right">Acties</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((user) => !showApproved || !user.admin_approved || !authorizedEmails.includes(user.email))
              .map((user) => (
                <TableRow key={user.id} className={!editedUsers[user.id] ? "bg-primary/20" : ""}>
                  {/* Gebruiker kolom - 2 regels */}
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <div className="font-semibold">{user.name || "-"}</div>
                      <div className="text-sm text-muted-foreground break-words">{user.email}</div>
                    </div>
                  </TableCell>
                  
                  {/* Contact kolom - 2 regels */}
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <div className="text-sm break-words">
                        {user.address && (
                          <>
                            {user.address}
                            {user.postal && `, ${user.postal}`}
                            {user.city && ` ${user.city}`}
                          </>
                        )}
                        {!user.address && !user.postal && !user.city && "-"}
                      </div>
                      {user.phoneNumber && (
                        <div className="text-sm text-muted-foreground">{user.phoneNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Bedrijfsinfo kolom - 2 regels */}
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      {user.companyName && (
                        <div className="text-sm font-medium break-words">{user.companyName}</div>
                      )}
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {user.vatNumber && <div>BTW: {user.vatNumber}</div>}
                        {user.chamberOfCommerceNumber && <div>KVK: {user.chamberOfCommerceNumber}</div>}
                        {!user.companyName && !user.vatNumber && !user.chamberOfCommerceNumber && "-"}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Status kolom */}
                  <TableCell className="align-top">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      editedUsers[user.id] 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {editedUsers[user.id] ? "Goedgekeurd" : "Nieuw"}
                    </span>
                  </TableCell>
                  
                  {/* Acties kolom */}
                  <TableCell className="align-top text-right">
                    <div className="flex flex-col gap-2 items-end">
                      <Button
                        className="bg-primary/70 font-bold text-black/70 hover:bg-primary dark:text-secondary dark:hover:text-secondary"
                        onClick={() => toggleApproval(user.id)}
                        size="sm"
                      >
                        {isSaving[user.id] ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : editedUsers[user.id] ? (
                          "Intrekken"
                        ) : (
                          "Goedkeuren"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary/70 hover:bg-primary/10"
                        onClick={() => sendPasswordReset(user.id)}
                        size="sm"
                      >
                        {isResettingPassword[user.id] ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Reset wachtwoord"
                        )}
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="hover:bg-red-700" 
                        onClick={() => confirmDeleteUser(user.id)}
                        size="sm"
                      >
                        {isDeleting[user.id] ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Verwijderen"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
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
