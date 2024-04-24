// netlify/functions/discogs-image.js

exports.handler = async (event, context) => {
  try {
    const method = event?.rawUrl?.split("/api/discogs-image/")[1];
    const proxyUrl = `https://i.discogs.com/${method}`;

    const response = await fetch(proxyUrl);
    const blob = await response.arrayBuffer();
    const data = Buffer.from(blob).toString("base64");

    return {
      statusCode: response.status,
      body: data,
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
