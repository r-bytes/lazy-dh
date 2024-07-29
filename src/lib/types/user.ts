export type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date | null;
  address?: string | null;
  city?: string | null;
  postal?: string | null;
  phoneNumber?: string | null;
  companyName?: string | null;
  vatNumber?: string | null;
  chamberOfCommerceNumber?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  adminApproved?: boolean;
};

export interface ApiResponse {
  success: boolean;
  users: DatabaseUser[];
}
