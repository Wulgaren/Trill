describe("Artist page", () => {
  it("Artist page", () => {
    const randomNumber = Math.floor(Math.random() * 5000);

    cy.intercept({
      path: `/api/discogs-api/artists/*`,
    }).as("artistPage");

    cy.visit(`http://localhost:8888/result/artist/${randomNumber}`);

    cy.get("nav").should("be.visible");

    cy.wait("@artistPage").then((result) => {
      if (result.response.statusCode == 200) {
        const parsed = JSON.parse(result.response?.body);
        if (parsed?.profile) {
          cy.get(".inline")
            .invoke("text")
            .should("not.match", /\[.*\*\]/);
        }
      }
    });

    cy.intercept({
      path: `/api/discogs-api/artists/${randomNumber}/releases*`,
    }).as("releases");

    cy.get(
      'button[title="Star artist to get recommendations based on them"',
    ).should("be.visible");

    cy.get(".pb-0 > .text-xl").contains("Similar artists");

    cy.wait("@releases").then((result) => {
      if (result.response.statusCode == 200) {
        const parsed = JSON.parse(result.response?.body);
        if (parsed?.releases?.length > 0) {
          cy.get(
            ":nth-child(1) > a > .flex-wrap > .aspect-square > .object-cover",
          ).should("be.visible");
        }
      }
    });
  });
});
