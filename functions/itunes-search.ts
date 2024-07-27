// netlify/functions/itunes-search.js

import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    // Extract necessary data from the request, if needed
    const { queryStringParameters } = event;
    const params = queryStringParameters;

    if (!params) {
      throw new Error("No params found.");
    }

    // Construct the URL for the external iTunes API request
    const apiUrl = `https://itunes.apple.com/search?term=${params.term}&entity=${params.entity}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "user-agent": "Trill/1.0.0" },
    });
    const data = await response.json();
    // Return the response
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
