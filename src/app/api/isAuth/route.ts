import { validateRequest } from "@/lib/db/auth";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  isAuthenticated?: boolean;
  session?: string;
  error?: string;
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  try {
    const { user, session } = await validateRequest();

    if (user) {
      return NextResponse.json({ isAuthenticated: true });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to authenticate user" }, { status: 500 });
  }
};
