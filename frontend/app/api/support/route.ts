import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("debugchi_front");
    const result = await db.collection("support").insertOne(body);
    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}