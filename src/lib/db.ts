import fs from "fs/promises";
import path from "path";

export type Member = {
  name: string;
  twitter?: string;
  youtube?: string;
  twitch?: string;
  uuid: string;
};

const dbFilePath = path.join(process.cwd(), "src/db/db.json");

export async function readDb(): Promise<{ members: Member[] }> {
  try {
    const data = await fs.readFile(dbFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or error, return empty structure
    return { members: [] };
  }
}

export async function writeDb(data: { members: Member[] }): Promise<void> {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
}
