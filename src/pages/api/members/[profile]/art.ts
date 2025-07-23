import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { profile } = req.query;

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { art, password } = req.body;

  if (!password) {
    return res.status(401).json({ error: "Password required" });
  }

  if (!profile || typeof profile !== "string") {
    return res.status(400).json({ error: "Invalid profile" });
  }

  if (!Array.isArray(art)) {
    return res.status(400).json({ error: "Invalid art array" });
  }

  const db = await readDb();
  const member = db.members.find(
    (m) => m.name.toLowerCase() === profile.toLowerCase()
  );

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  if (!member.password) {
    return res.status(403).json({ error: "No password set for member" });
  }

  const passwordMatches = await bcrypt.compare(password, member.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Update art array
  member.art = art;
  await writeDb(db);

  return res.status(200).json({ message: "Art updated successfully" });
}
