import { readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "src/data/cities.json");
  const jsonData = await readFile(filePath, "utf-8");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.status(200).send(jsonData);
}
