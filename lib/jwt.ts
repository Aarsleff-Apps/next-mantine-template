function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
}

/** Decodes a JWT's payload without verifying its signature (verification already happened at issuance). */
export function decodeJwtPayload<T>(token: string): T {
  return JSON.parse(base64UrlDecode(token.split(".")[1]));
}
