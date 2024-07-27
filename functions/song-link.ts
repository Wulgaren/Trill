import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    // Extract necessary data from the request, if needed
    const { queryStringParameters } = event;
    const params = queryStringParameters;

    if (!params?.url) {
      throw new Error("No params found.");
    }

    // Construct the URL for the external SongLink API request
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(params.url)}&userCountry=US&songIfSingle=true`;

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
