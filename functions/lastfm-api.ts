// functions/lastfm-api.js

import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  try {
    // Retrieve your API key from environment variables
    const apiKey = process.env.LAST_FM_API_KEY;

    // Extract necessary data from the request, if needed
    const { rawQuery } = event;

    // Construct the URL for the external Last.fm API request
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?${rawQuery}&api_key=${apiKey}`;

    // Make the request to the external Last.fm API using fetch
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Return the response from the external Last.fm API
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle any errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};

export { handler };
