import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config/env";

async function proxyToBackend(request: NextRequest) {
  const headers: HeadersInit = {};
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (authorization) headers.Authorization = authorization;
  if (contentType) headers["Content-Type"] = contentType;

  const response = await fetch(`${API_BASE_URL}/api/courriers/juridique`, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.text(),
  });

  const text = await response.text();
  const responseContentType = response.headers.get("content-type") || "application/json";

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "content-type": responseContentType,
    },
  });
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}
