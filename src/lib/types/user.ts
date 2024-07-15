export type dbUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date | null;
  address?: string | null;
  phoneNumber?: string | null;
};
