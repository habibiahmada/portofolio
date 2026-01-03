export async function fetchPdf(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch PDF");
  return res.arrayBuffer();
}
