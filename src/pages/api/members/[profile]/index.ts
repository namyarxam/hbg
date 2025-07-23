import type { NextApiRequest, NextApiResponse } from "next";
import { readDb } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { profile } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!profile || typeof profile !== "string") {
    return res.status(400).json({ error: "Invalid profile" });
  }

  const db = await readDb();
  const member = db.members.find(
    (m) => m.name.toLowerCase() === profile.toLowerCase()
  );

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  return res.status(200).json(member);
}
