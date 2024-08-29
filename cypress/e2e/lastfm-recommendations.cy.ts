describe("Last.fm recommendations", () => {
  it("Last fm login and recommendations", () => {
    cy.visit("http://localhost:8888");

    cy.get("nav").should("be.visible");
    cy.get("#hamburger-toggle").click();
    cy.get('button[title="Last.fm Options"]').should("be.visible").click();

    cy.intercept({
      path: "/api/lastfm-api/?method=tag.getTopAlbums&*",
    }).as("lastfmTopAlbums");

    cy.get("input#LastFmUsername")
      .should("be.visible")
      .type("natios100")
      .parent()
      .submit();
    cy.get("dialog").should("not.be.visible");

    cy.get(".bg-white > .text-xl").contains(
      "Based on your favorite artists' genres",
    );
    cy.wait("@lastfmTopAlbums");
    cy.get(
      '[style="width: 180px; transform: translateX(0px);"] > .min-w-\\[180px\\] > a',
    ).should("be.visible");
  });
});
