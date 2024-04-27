// netlify/functions/discogs-api.js

import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    const generateRandomString = () => {
      return Math.random().toString(36).substring(2);
    };
    const generateOAuthTimestamp = () => {
      return Math.floor(Date.now() / 1000).toString();
    };

    // Added rest of auth headers from .env
    let auth = event?.headers?.authorization?.toString();
    if (!auth) {
      auth = `Discogs key="${process.env.DISCOGS_CONSUMER_KEY}", secret="${process.env.DISCOGS_CONSUMER_SECRET}"`;
    } else {
      auth += `, oauth_consumer_key="${process.env.DISCOGS_CONSUMER_KEY}", oauth_nonce="${generateRandomString()}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${generateOAuthTimestamp()}"`;
      auth = auth.replace(
        'oauth_signature="&',
        `oauth_signature="${process.env.DISCOGS_CONSUMER_SECRET}&`,
      );
    }

    const method = event?.rawUrl?.split("/api/discogs-api/")[1];
    const proxyUrl = `https://api.discogs.com/${method}`;
    const requestOptions = {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Trill/1.0.0",
        Authorization: auth,
      },
    };

    const response = await fetch(proxyUrl, requestOptions);
    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler };
