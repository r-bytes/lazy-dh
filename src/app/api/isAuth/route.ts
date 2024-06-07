import { validateRequest } from "@/lib/db/auth";
import { User } from "lucia";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
  try {
    const { user } = await validateRequest();
    if (user) {
      return NextResponse.json({ isAuthenticated: true });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to authenticate user" }, { status: 500 });
  }
};