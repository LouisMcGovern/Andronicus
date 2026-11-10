/*
 * Stripe payment links for the booking section.
 * Paste each link from the Stripe Dashboard (Payment Links / Customer portal) between the quotes.
 * While a link is empty, its button stays disabled and parents see "coming soon".
 */
window.ANDRONICUS_PAYMENTS = {
  // Subscription payment link: "Monthly pass", €100 every month
  monthlyPassLink: "",
  // One-off payment link: "One class", €25, with "Let customers adjust quantity" set to 1–10
  classPackLink: "",
  // Customer portal login link (Settings › Billing › Customer portal), so parents can cancel the pass
  manageLink: "",
};
