// netlify/functions/discogs-oauth-access-token.js

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
    let auth = event?.headers?.authorization?.toString() ?? "";
    auth += `, oauth_consumer_key="${process.env.DISCOGS_CONSUMER_KEY}", oauth_nonce="${generateRandomString()}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${generateOAuthTimestamp()}"`;
    auth = auth.replace(
      'oauth_signature="&',
      `oauth_signature="${process.env.DISCOGS_CONSUMER_SECRET}&`,
    );

    const proxyUrl = "https://api.discogs.com/oauth/access_token";
    const requestOptions = {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Trill/1.0.0",
        Authorization: auth,
      },
    };

    const response = await fetch(proxyUrl, requestOptions);
    const data = await response.text();

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
