describe("Trending artists", () => {
  it("Trending artists appeared", () => {
    cy.visit("http://localhost:8888");
    cy.get("nav").should("be.visible");
    cy.get(".bg-white > .text-xl").contains("Trending artists");
    cy.get(
      '[style="width: 180px; transform: translateX(0px);"] > .min-w-\\[180px\\] > a > .flex-nowrap > .h-48 > .object-cover',
    ).should("be.visible");
  });
});
