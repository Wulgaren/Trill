describe("Master page", () => {
  it("Master page", () => {
    const randomNumber = Math.floor(Math.random() * 5000);

    cy.intercept({
      path: `/api/discogs-api/masters/*`,
    }).as("masterPage");

    cy.visit(`http://localhost:8888/result/master/${randomNumber}`);

    cy.get("nav").should("be.visible");

    cy.wait("@masterPage");
    cy.get(".mb-1 > ul > li > .relative")
      .should("exist")
      .and("not.have.text", "");

    cy.get(".pb-0 > .text-xl").contains("Similar albums");
  });
});
