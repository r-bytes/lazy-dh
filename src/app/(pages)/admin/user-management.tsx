"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse, DatabaseUser } from "@/lib/types/user";
import { EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserManagement = ({ userIdFromProps }: { userIdFromProps: string }) => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedUsers, setEditedUsers] = useState<Record<string, boolean>>({});
  const [showApproved, setShowApproved] = useState(false); // State to toggle visibility of approved users

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data: ApiResponse = await res.json();
      if (data.success) {
        const usersRequiringApproval = data.users.filter((user) => showApproved || !user.adminApproved);
        setUsers(usersRequiringApproval);
        const initialStatus = usersRequiringApproval.reduce<Record<string, boolean>>((acc, user) => {
          acc[user.id] = user.adminApproved!;
          return acc;
        }, {});
        setEditedUsers(initialStatus);
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Fout bij het ophalen van de gebruikers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showApproved]); // Effect runs when showApproved changes

  const toggleApproval = async (userId: string) => {
    const currentApproval = !editedUsers[userId];
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminApproved: currentApproval }),
      });
      const data = await res.json();
      if (data.success) {
        setEditedUsers((prev) => ({ ...prev, [userId]: currentApproval }));
        toast.success("Gebruiker goedgekeurd");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Fout bij het bijwerken van de status");
      console.error("Error updating user status:", error);
    }
  };

  if (loading) {
    return <p className="flex items-center justify-center">Loading users...</p>;
  }

  return (
    <div className="flex flex-col items-center overflow-x-scroll text-muted-foreground lg:min-w-fit">
      <h1 className="my-4 text-center text-3xl font-bold">User Management</h1>
      <TableCell className="self-end hover:cursor-pointer" onClick={() => setShowApproved(!showApproved)}>
        {showApproved ? <EyeIcon /> : <EyeOff />}
      </TableCell>
      <Table className="w-full min-w-fit">
        <TableHeader>
          <TableRow className="min-w-fit">
            <TableCell className="min-w-fit"> Naam </TableCell>
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
    </div>
  );
};

export default UserManagement;
