import type { NextApiRequest, NextApiResponse } from "next";
import { readDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { profile } = req.query;
  const { password } = req.body;

  if (!profile || typeof profile !== "string") {
    return res.status(400).json({ error: "Invalid profile" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password required" });
  }

  const db = await readDb();
  const member = db.members.find(
    (m) => m.name.toLowerCase() === profile.toLowerCase()
  );

  if (!member || !member.password) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const isValid = await bcrypt.compare(password, member.password);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  return res.status(200).json({ message: "Authorized" });
}
