export interface Content {
  meta: { title: string; description: string };
  nav: { cta: string };
  opening: { eyebrow: string; line: string; sub: string; cta_primary: string; cta_secondary: string };
  services: { heading: string; intro: string; items: { id: string; name: string; line: string; body: string }[] };
  addon: { label: string; heading: string; body: string; cta: string };
  checks: { heading: string; intro: string; items: { title: string; line: string }[] };
  work: { heading: string; items: { name: string; kind: string; line: string; confirmed: boolean }[] };
  people: { heading: string; items: { name: string; role: string }[] };
  contact: { heading: string; line: string; email: string; phones: string[]; cta: string };
  footer: { line: string };
}
