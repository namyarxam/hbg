import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, Member } from "@/lib/db";
import { v1 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const db = await readDb();
    return res.status(200).json(db.members);
  }

  if (req.method === "POST") {
    const { name, twitter, youtube, twitch, mcuuid, sr } = req.body;

    if (!name || !twitter || !youtube || !twitch) {
      return res
        .status(400)
        .json({ error: "name, twitter, youtube, and twitch are required" });
    }

    const db = await readDb();
    const id = uuidv4();

    const rawPassword = twitch + "hbg";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newMember: Member = {
      name,
      twitter,
      youtube,
      twitch,
      mcuuid,
      sr,
      id,
      art: [],
      password: hashedPassword,
    };
    db.members.push(newMember);
    await writeDb(db);

    return res.status(201).json(newMember);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing member id" });
    }

    const db = await readDb();
    const index = db.members.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    db.members.splice(index, 1);
    await writeDb(db);

    return res.status(200).json({ message: "Member deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
