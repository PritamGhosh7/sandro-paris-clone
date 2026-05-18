import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  productId: z.string(),
  productSku: z.string(),
  productImage: z.string().url(),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = Body.parse(await request.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Simulate model latency
  await new Promise((r) => setTimeout(r, 2200));

  // Mock: echo the product image as the "result". When wired to a real
  // model (fal.ai CatVTON / IDM-VTON / Replicate IDM-VTON), this is the
  // only function that changes — store the input image in Supabase Storage,
  // pass URLs to the model, persist the result, return resultUrl.
  return NextResponse.json({
    status: "ready",
    sessionId: `mock_${Date.now()}_${parsed.productSku}`,
    resultUrl: parsed.productImage,
  });
}
