import { getPlaiceholder } from "plaiceholder";
import fs from "fs/promises";
import path from "path";

export async function getBlurData(imagePath: string) {
  const file = await fs.readFile(
    path.join(process.cwd(), "public", imagePath)
  );

  const { base64 } = await getPlaiceholder(file);
  return base64;
}
