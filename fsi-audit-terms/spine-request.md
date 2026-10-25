You are planning a long document that a LOCAL language model will write one section at a time, 400 to 600 words a section, from the facts you hand it. You decide the shape; you never write body prose. Return ONLY a JSON object, no prose before or after, no markdown fence.

Requirements for the plan:
- "title": the document's title.
- "reader": {"who": one line, "decides": what they will decide or do with it, "lacks": exactly three facts they do not yet have}.
- "register_notes": two to four sentences on the voice this document needs, in plain words.
- "glossary": an object of the terms every section must use consistently, each with a one-line meaning (the local model writes sections independently; this is how the document keeps one vocabulary).
- "never": document-specific things no section may say or do (claims outside the brief, names not to use, framings the brief forbids).
- "sections": an array, in reading order. Each: {"n": number from 1, "heading": a heading that states the point in plain words, never a bare label, "purpose": one sentence, what the reader must understand after it, "facts": the facts this section may use, copied verbatim from the brief, never invented, "carry_in": one line, what earlier sections have already given the reader, "hand_off": one line, what the next section will do, "words": target length 400 to 600}.
- "gaps": facts the brief needed and does not contain, each as one line, so the human can supply them. Never fill a gap yourself.

Judgment rules: the first section leads with the worst true fact, or the thing that matters most to the reader, never with background. No section summarises the document. Every fact in "facts" must appear in the brief. Sections must depend on each other: each builds on the last. Allocate words by importance, not evenly: a section that carries the argument may take 600, a section that dispatches a point may take 400. The last section's purpose is the reader's next action. Headings state the point ("The client keeps the system"), never a label ("Ownership").

THE BRIEF:

# Free audit terms page: brief for the local writer (flowlong)

Built 25 Oct 2026 by P157 from TERMS-SPEC-BILAL.md (Bilal, operations) with Asif's answers applied. Facts only; every body sentence is written by the local model.

PURPOSE: The star beside "Free for a limited time" on every audit button links to this page. It says plainly what the free audit is, what it is not, and what each side can expect, so nobody is surprised later, and so nobody can turn a free audit into free consulting.

READER: A small business owner in Dhaka or London who has never met us, reading on a phone, maybe in a second language. A six-year-old should be able to say back the deal: you get one call and one written letter about your business, it is free, you wait your turn, one per company. Calm and respectful, like a host explaining the house rules, never a guard reading out penalties.

RIVAL: The usual terms and conditions page: dense legal words ("hereinafter", "the Client shall", "notwithstanding"), capital-letter walls, written to win a court case rather than to be understood. This page must be the opposite: every clause readable in one pass, with the legal idea said in everyday words.

REGISTER: Measured professional, child-clear in meaning. Complete sentences. Short paragraphs. No slogans, no selling, no jokes. No em dashes. Never mention Akij. Never say or hint that the studio chooses or judges who gets a place: no shortlisting, curating, selecting, "successful applicants". Places go in order.

FORMAT: Open with THE SHORT VERSION: four or five plain sentences (one free call, one written read-out, waiting-list order, one per company, no obligation). Then the full terms in ten groups, A to J, in the order below. Each clause gets its own short plain heading that states its point (for example "You keep your read-out", never "Intellectual Property"), followed by one to three sentences. Keep the clause order. Target 1,500 to 1,800 words in total.

FACTS (use these and nothing else; never add a number, a promise or a party that is not here):

Company: FlowState Impact, a business registered in Dhaka, Bangladesh. Never describe the legal form of the business. No registration number and no street address appear on the page.

A. WHO CAN TAKE PART
1. One free audit per company, once.
2. Companies with the same owner, the same group or the same management count as one company.
3. A company that has had its audit, or lost its place under these terms, cannot apply again under another name, a new trading name or through another person.
4. The person applying must be the owner, a director, or someone the owner has allowed to apply and to share business details.
5. People who run or work for a competing studio or consultancy cannot take part, including applying for them or for their clients. If this comes to light later, the audit ends.

B. THE WAITING LIST
6. There are 10 places. Places go strictly in the order complete applications arrive, by the date and time we receive them.
7. An application is complete when the form is filled in and the contact details work. We confirm a place on the list by email within 2 working days.
8. A place belongs to the company and cannot be sold, swapped, handed to another business, or exchanged for money, a discount or any paid alternative.
9. When the 10 places are filled, new applicants stay on the waiting list, in order. If a place frees up, it goes to the next on the list. Being on the list does not promise a place.
10. The offer runs for a limited time. There is no fixed end date. It ends when the 10 places are used, or earlier if we close it; if we close it, we say so on this page and tell everyone still on the list by email. A place on the list does not carry over to any later offer unless we say so in writing.

C. WHAT YOU GET, AND WHAT YOU DO NOT
11. The audit is one video call of up to 60 minutes and one written read-out, sent by email within 10 working days after the call.
12. Working days are Sunday to Thursday, not counting public holidays in Bangladesh. If something outside our control delays the read-out, we say so and give a new date.
13. We do not carry out any of the work the read-out suggests: no design, writing, building, strategy work, extra calls, unlimited follow-up questions or rewriting of the read-out. You may send one email of questions about the read-out within 14 days of receiving it, and we answer it once.
14. The read-out is a finished document, not a draft. We do not rewrite it to match a view you prefer. If we got a fact wrong through our own mistake, tell us and we correct that fact.
15. Paid work, if you want it later, is a new and separate agreement with its own written scope and terms. Nothing in the read-out is a price, a quote or a promise of what paid work would include.

D. WHAT WE NEED FROM YOU
16. The read-out rests on what you share. We may send a short set of questions before the call. If the information is incomplete or wrong, the read-out will be too, and we are not responsible for that.
17. Giving false details ends the audit: a false company name, a false role, or hiding that you work for a competing studio.

E. MOVED, MISSED OR LATE CALLS
18. To move the call, tell us at least 24 hours before. You can move it once. After that, the place goes to the next on the list.
19. If you do not join and did not tell us, we wait 15 minutes, then the call is closed and the place passes to the next on the list.
20. If you join late, the call still ends at its booked time.
21. If we need to move the call, we tell you as early as we can and offer a new time. You keep your place.

F. WHO OWNS WHAT
22. You keep the read-out for your own business use. You may share it inside your company and with your own advisers, for example your accountant or lawyer.
23. Our questions, the way we structure the read-out, our templates, scoring and working tools stay the property of FlowState Impact. Receiving a read-out gives no right to them.
24. The read-out may not be sold, posted publicly, used to train software, presented as your own work, or used to give the same service to others.
25. Using our name, the read-out or quotes from it in marketing or the press needs our written permission first.
26. No recording or sharing of the call unless both sides agree first. This includes AI note-taking tools and meeting bots. We take our own written notes.

G. ADVICE, RESPONSIBILITY AND NO OBLIGATION
27. The audit is not legal, financial, tax or accounting advice. For those, speak to a qualified professional.
28. The read-out is our honest view on the day it is written. We promise no result from following it, and we are not responsible for decisions you make or losses that follow, as far as the law allows. Nothing here removes rights that the law says cannot be removed.
29. You owe us nothing and are under no obligation to buy anything. We are under no obligation to offer paid work. We may tell you once what paid work would look like; we will not chase you, and nothing renews or charges automatically.

H. PRIVACY
30. What you share is used only to prepare your audit. We do not share it outside the studio, except where the law requires it, or with a trusted contractor who works for us under the same duty of privacy.
31. If we want to use a lesson from your audit with your name and details removed, for example in an article, we ask you first in writing. Using your name or company in a case study needs a separate written yes.
32. We keep audit material for 12 months, then delete it, unless you become a paid client. Data protection rights you have where you live still apply.
33. We do not add you to a mailing list unless you say yes.

I. WHEN WE MAY DECLINE, PAUSE OR END AN AUDIT
34. We may decline, pause or end an audit when a rule here is broken: false details (17), working for or applying for a competing studio (5), recording or sharing without agreement (26), resale or misuse of the read-out (24), or rude, threatening or abusive behaviour towards anyone in the studio. When we do, we tell you which rule was broken.
35. If running your audit would mean using what another client told us in private, we tell you and cannot run it. You keep your place on the list if the conflict ends while the offer is open.

J. GENERAL
36. We may change or end the offer. Changes are posted on this page with the date. A change never takes away a place already confirmed, or the call and read-out already promised to someone holding one.
37. These terms and your booking confirmation are the whole agreement for the audit. If one clause turns out not to be valid, the rest still stand.
38. These terms follow the law of Bangladesh, and the courts of Dhaka decide any dispute. Before going to court, both sides first try to settle a problem in writing for 30 days.
39. Contact: questions about these terms go to CONTACT_EMAIL. Last updated: LAST_UPDATED. (Write the two capitalised tokens exactly as they are; they are filled in by hand later.)

BANNED: every word on the studio ban list (certainly, leverage, seamless, journey, unlock, empower, elevate, solution, robust, innovative, passionate, worth, ultimately, in conclusion). No legal Latin. No "hereinafter", "shall", "notwithstanding", "the Client". No sole trader or any legal-form wording. No Akij.
