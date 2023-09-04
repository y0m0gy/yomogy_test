// /pages/api/getToken.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }

  const clientID = process.env.GITHUB_APP_CLIENT_ID;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientID,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("GitHub API Error:", data.error_description || data.error);
      return res.status(401).json({ error: data.error });
    }

    return res.status(200).json({ access_token: data.access_token });
  } catch (error) {
    console.error("Error fetching GitHub access token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
