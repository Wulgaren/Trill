// functions/musicbrainz-api.js

exports.handler = async (event, context) => {
  try {
    // Extract necessary data from the request, if needed
    const { queryStringParameters } = event;
    const params = queryStringParameters;

    // Construct the URL for the external Musicbrainz API request
    const apiUrl = `http://musicbrainz.org/ws/2/artist/${params.mbid}?inc=${params.inc}&fmt=${params.fmt}`;

    // Make the request to the external Musicbrainz API using fetch
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "user-agent": "Trill/1.0.0" },
    });
    const data = await response.json();
    // Return the response from the external Musicbrainz API
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
