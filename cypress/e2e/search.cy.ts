describe("searching", () => {
  it("search", () => {
    cy.visit("http://localhost:8888");

    cy.get("nav").should("be.visible");

    cy.intercept(
      "/api/discogs-api/database/search?query=Radiohead&type=artist&page=1",
    ).as("discogsSearch");

    cy.intercept("/api/discogs-api/artists/3840").as("RadioheadPage");

    cy.get('a[title="Open search"').should("be.visible").click();
    cy.get('button[aria-label="Search filters"').click();
    cy.get("#searchType").select("artist");
    cy.get("#searchInput")
      .should("be.visible")
      .type("Radiohead")
      .parents("form")
      .submit();

    cy.wait("@discogsSearch");

    cy.get(":nth-child(1) > .overflow-clip > .absolute")
      .contains("Radiohead")
      .parent("a")
      .click();

    cy.wait("@RadioheadPage");

    cy.get("h1").contains("Radiohead");

    cy.get(
      'button[title="Star artist to get recommendations based on them"',
    ).should("be.visible");
  });
});
