import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const formdata = new FormData();
  formdata.append("grant_type", "client_credentials");
  formdata.append("client_id", process.env.CLIENT_ID as string);
  formdata.append(
    "client_secret", 
    process.env.CLIENT_SECRET as string
  );
  formdata.append("resource", "https://graph.microsoft.com/");

  const token = await fetch(
    "https://login.microsoftonline.com/ed76ab48-efcd-4ee8-9a0b-02284511985d/oauth2/token",
    {
      method: "POST",
      body: formdata,
      redirect: "follow",
    }
  )
    .then((response) => response.text())
    .then((result) => JSON.parse(result).access_token);

  const userProfile = await fetch(
    `https://graph.microsoft.com/v1.0/users/${req.query.user}/?$select=jobTitle,department`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ConsistencyLevel: "eventual",
      },
      redirect: "follow",
    }
  ).then((response) => response.json());
  const {jobTitle, department} = userProfile;

  const { userId, sessionClaims } = getAuth(req);

  const metadata = {
    publicMetadata: {
      jobTitle: jobTitle,
      department: department,
      ...sessionClaims?.metadata
    },
  };

  // Send updated metadata to Clerk
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId as string, metadata);

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${req.query.user}/photo/$value`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ConsistencyLevel: "eventual",
      },
      redirect: "follow",
    }
  )

  const blob = await response.blob();

  const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length") || blob.size;

    // converting blob to raw buffer for transferring
    // (other formats including blob was not working)
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return res
      .status(200)
      .setHeader("Content-Type", contentType)
      .setHeader("Content-Length", contentLength)
      .send(buffer);
}
