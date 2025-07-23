import fs from "fs/promises";
import path from "path";

export type TwitchAuth = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type Member = {
  id: string;
  name: string;
  twitter: string;
  youtube: string;
  twitch: string;
  mcuuid?: string;
  sr?: string;
  art?: string[];
  password?: string;
};

export type DbData = {
  twitchAuth: TwitchAuth;
  members: Member[];
};

const dbFilePath = path.join(process.cwd(), "src/db/db.json");

export async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or error, return empty structure
    return {
      twitchAuth: {
        accessToken: "",
        refreshToken: "",
        expiresAt: 0,
      },
      members: [],
    };
  }
}

export async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
}
