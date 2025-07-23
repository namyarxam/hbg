import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, Member } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const db = await readDb();
    return res.status(200).json(db.members);
  }

  if (req.method === "POST") {
    const { name, twitter, youtube, twitch, uuid } = req.body;

    if (!name || !uuid) {
      return res.status(400).json({ error: "Name and uuid are required" });
    }

    const db = await readDb();

    if (db.members.find((m) => m.uuid === uuid)) {
      return res.status(409).json({ error: "UUID already exists" });
    }

    const newMember: Member = { name, twitter, youtube, twitch, uuid };
    db.members.push(newMember);
    await writeDb(db);

    return res.status(201).json(newMember);
  }

  if (req.method === "DELETE") {
    const { uuid } = req.body;

    if (!uuid) {
      return res
        .status(400)
        .json({ error: "UUID is required to delete a member" });
    }

    const db = await readDb();
    const index = db.members.findIndex((m) => m.uuid === uuid);

    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    db.members.splice(index, 1);
    await writeDb(db);

    return res.status(200).json({ message: "Member deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
