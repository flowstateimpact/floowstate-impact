You are the editor of a document whose body was written one section at a time by a local model, from the plan below. Your job is the connective work a section-by-section build cannot do for itself: does it read as one document in one voice, does each section deliver its purpose, do the joins hold, is anything repeated, contradicted or invented. You judge and instruct. You never supply the wording: the local model will re-word whatever you flag, from your instruction. Return ONLY a JSON object, no prose before or after, no markdown fence:

{
 "summary": "plain-language note for the human reader: what holds, what does not, in a few sentences",
 "sections": [{"n": 1, "delivers_purpose": true, "note": "one line"}],
 "edits": [{"n": 3, "where": "opening" | "closing" | "sentence" | "whole", "quote": "for sentence only: the exact sentence to re-word", "instruction": "what the rewritten paragraph (or sentence, or section) must do, in one or two sentences, no wording supplied"}],
 "cuts": [{"n": 4, "quote": "an exact sentence from the draft to delete, copied character for character"}],
 "terms": [{"prefer": "the exact term to use", "over": "the term to replace"}]
}

Rules: at most two edits per section. "opening" rewrites the first paragraph, "closing" the last, "sentence" re-words one exact quoted sentence in place, "whole" regenerates the section and is only for a section that misses its purpose. Cuts are for sentences that repeat another section, restate the heading, summarise, or claim something the brief never gave; the quote must match the draft exactly. Terms unify vocabulary across sections. If a join between two sections is abrupt, fix it with the closing of the first or the opening of the second, whichever is the weaker paragraph. Prefer few, precise instructions over many. An empty list is a valid answer.

THE PLAN:
{
 "title": "Free audit terms: one call, one written read-out, one per company",
 "reader": {
  "who": "A small business owner in Dhaka or London who has never met us, reading on a phone, maybe in a second language.",
  "decides": "Whether to apply for the free audit, knowing exactly what they get, what they agree to, and that they owe nothing.",
  "lacks": [
   "That the free audit is exactly one video call of up to 60 minutes and one written read-out, and that we do none of the work the read-out suggests.",
   "That the 10 places go strictly in the order complete applications arrive, and that being on the waiting list does not promise a place.",
   "That they owe nothing and are under no obligation to buy, and that nothing renews or charges automatically."
  ]
 },
 "register_notes": "Measured professional in form and child-clear in meaning: complete sentences, short paragraphs, and everyday words that a reader on a phone, perhaps in a second language, can follow in one pass. The tone is a calm host explaining the house rules, never a guard reading out penalties: each clause says plainly what happens, without threat, apology or legal wording. Write as \"we\" speaking to \"you\", and say every legal idea in the everyday words for it. No selling, no slogans, no jokes, and no em dashes.",
 "glossary": {
  "the free audit": "One video call of up to 60 minutes and one written read-out, given free; also \"the audit\", never a consultation, review or session.",
  "the call": "The one video call of up to 60 minutes that is part of the audit.",
  "read-out": "The one written document we send by email within 10 working days after the call; always \"read-out\", never report, letter or summary.",
  "place": "One of the 10 free audits on offer.",
  "the waiting list": "The queue of complete applications, kept strictly in the order they arrive by date and time; \"the list\" means the same thing.",
  "complete application": "The form filled in, with contact details that work.",
  "working days": "Sunday to Thursday, not counting public holidays in Bangladesh.",
  "the offer": "The free audit offer as a whole, which runs for a limited time with no fixed end date.",
  "paid work": "Any work done for money later, under a new and separate agreement with its own written scope and terms.",
  "paid client": "A company with a separate paid agreement with us; never call someone taking the free audit a client.",
  "competing studio or consultancy": "Another studio or consultancy in competition with FlowState Impact.",
  "we, us, our": "FlowState Impact and the people who work in the studio.",
  "you, your": "The company taking the audit and the person who applies for it.",
  "the studio": "The people of FlowState Impact, as in \"outside the studio\" and \"anyone in the studio\".",
  "these terms": "The rules on this page, which together with the booking confirmation are the whole agreement for the audit."
 },
 "never": [
  "Never mention Akij in any form.",
  "Never say or hint that the studio chooses, judges or ranks who gets a place: no shortlisting, curating, selecting, \"successful applicants\", \"chosen\" or \"accepted\". Places go in order.",
  "Never describe the legal form of the business (no sole trader, limited company or partnership), and never give a registration number or a street address.",
  "Never claim an office, team or legal presence in London; the facts say only that the business is registered in Dhaka, Bangladesh.",
  "Never add a number, date, price, promise, deadline or party that is not in the facts: no end date for the offer, no reply time for questions, no price or discount for paid work.",
  "Never describe what the audit looks at beyond \"your business\"; the facts do not say.",
  "Never use legal wording: hereinafter, shall, notwithstanding, the Client, whereas, herein, thereof, force majeure, or any legal Latin.",
  "Never use a word on the studio ban list, including: certainly, of course, absolutely, leverage, seamless, journey, unlock, empower, elevate, solution, robust, innovative, cutting-edge, framework, ecosystem, synergy, passionate, worth, ultimately, in conclusion, to summarize.",
  "Never use an em dash; use a full stop or a comma instead.",
  "Never sell, joke or write a slogan, and never praise the studio or the value of the audit.",
  "Never sound like a guard reading out penalties: no threats, no \"failure to comply\", no \"prohibited\"; say calmly what happens.",
  "Never merge two clauses under one heading, never drop a clause, and never change the order of groups A to J or of the clauses inside them.",
  "Never renumber or drop the clause numbers 1 to 39; each clause keeps its number before its heading, because clause 34 points back to clauses 5, 17, 24 and 26.",
  "Never give a clause a bare label heading (Eligibility, Intellectual Property, Liability, Termination, Governing Law, Severability); every clause heading states its point, like \"You keep your read-out\".",
  "Never write a paragraph in capital letters; only THE SHORT VERSION and the group headings keep the capitals the brief gives them.",
  "Never call the read-out a report, letter or summary, or the audit a consultation; use the glossary terms.",
  "Never promise that being on the waiting list leads to a place.",
  "Never change the company name from FlowState Impact.",
  "Never fill in CONTACT_EMAIL or LAST_UPDATED; write both tokens exactly as they are.",
  "Never close a section with a summary, a recap or a sign-off."
 ],
 "sections": [
  {
   "n": 1,
   "heading": "You get one free call and one written read-out, and each company takes part once",
   "purpose": "The reader can say back the whole deal from THE SHORT VERSION (one free call, one written read-out, waiting-list order, one per company, no obligation), then knows from group A who may apply and that each company takes part only once.",
   "hand_off": "Section 2 shows how the 10 places are handed out in order and exactly what one place gives and does not give."
  },
  {
   "n": 2,
   "heading": "The 10 places go in the order applications arrive, and a place gives you one call and one read-out",
   "purpose": "The reader understands that the 10 places go strictly by arrival time and cannot be traded, what happens when they are full or the offer closes, and exactly where the free audit stops and paid work would begin.",
   "hand_off": "Section 3 sets out what the reader gives in return: true details, a kept call, and respect for who owns what."
  },
  {
   "n": 3,
   "heading": "Your part is true details, a kept call, and respect for what each side owns",
   "purpose": "The reader understands that the read-out is only as good as what they share, what happens if the call is moved, missed or joined late, and that they keep their read-out for their own use while our methods stay ours and nobody records the call without both sides agreeing.",
   "hand_off": "Section 4 closes the terms: the limits of the advice, no obligation either way, privacy, when an audit can end, and where to send a question."
  },
  {
   "n": 4,
   "heading": "You owe us nothing, your details stay private, and any ending or change is told to you",
   "purpose": "The reader understands the limits of the advice, that neither side owes the other anything more, how their details are kept and deleted, when an audit or the offer can end and how they are told, and that their next step with any question about these terms is to write to the contact address.",
   "hand_off": "Nothing follows; the page ends on the contact line and the last-updated date."
  }
 ]
}

WHAT THE MECHANICAL SCANS FOUND (the prose gate on the whole draft, then repetition across sections):

- advisory: four or more sentences in a row at nearly the same length (the metronome tell). Cut one to six words or let one run long.
- advisory: 8 sentences start with "the"; vary the openings.
- the phrase "for a competing studio" appears in sections 1, 3, 4

THE DRAFT, with section markers:

[S1] You get one free call and one written read-out, and each company takes part once

THE SHORT VERSION

The free audit is exactly one video call of up to 60 minutes and one written read-out. We send the read-out by email within 10 working days after the call. There are 10 places in total. They go strictly in the order complete applications arrive, by date and time. Each company takes part only once. You owe us nothing and are under no obligation to buy anything.

A. WHO CAN TAKE PART

1. One free audit per company, once
Each company can take part in the free audit only one time. This limit applies across the entire offer period, regardless of when you apply.

2. Related companies count as one
Companies with the same owner, the same group or the same management count as one company for this purpose. They share a single place if they apply together or separately.

3. No re-applying under another name
A company that has had its audit, or lost its place under these terms, cannot apply again. This includes using another name, a new trading name, or asking another person to apply on their behalf.

4. Who can apply on your behalf
The person applying must be the owner, a director, or someone the owner has allowed to apply. That person must also have permission to share business details with us during the process.

5. No participation from competitors
People who run or work for a competing studio or consultancy cannot take part. This includes applying for them directly or on behalf of their clients. If this situation comes to light later, the audit ends immediately.

[S2] The 10 places go in the order applications arrive, and a place gives you one call and one read-out

B. THE WAITING LIST

6. Ten places exist
There are exactly 10 places available for the free audit. Places go strictly in the order complete applications arrive, by the date and time we receive them. No other factor determines who gets a spot first.

7. What makes an application complete
An application is complete when the form is filled in and the contact details work. We confirm a place on the list by email within 2 working days of receiving your submission. This confirmation tells you your position in the queue clearly.

8. A place belongs to your company only
The place belongs to the specific company that applied for it. It cannot be sold, swapped, or handed to another business. You also cannot exchange it for money, a discount, or any paid alternative. The slot is tied directly to your application and stays there.

9. What happens when places are full
When all 10 places are filled, new applicants stay on the waiting list in order. If a place frees up later, it goes to the next person on the list. Being on the list does not promise you a place. It only means you are in the queue for that specific offer and wait for space.

10. When the offer ends
The offer runs for a limited time with no fixed end date. It ends when the 10 places are used, or earlier if we close it. If we close it, we say so on this page and tell everyone still on the list by email. A place on the list does not carry over to any later offer unless we say so in writing.

C. WHAT YOU GET, AND WHAT YOU DO NOT

11. The exact contents of the audit
The audit consists of one video call of up to 60 minutes and one written read-out. We send this read-out by email within 10 working days after the call. This is the complete deliverable you receive for free. There are no other items included in this service package.

12. How we count working days
Working days for us are Sunday to Thursday, not counting public holidays in Bangladesh. If something outside our control delays the read-out, we say so and give a new date. You will always know where things stand and when to expect updates.

13. We do not do the work suggested
We do not carry out any of the work the read-out suggests. This means no design, writing, building, or strategy work is included in the free offer. There are no extra calls, unlimited follow-up questions, or rewriting of the read-out provided either. You may send one email of questions about the read-out within 14 days of receiving it, and we answer it once.

14. The read-out is final
The read-out is a finished document, not a draft to be tweaked. We do not rewrite it to match a view you prefer or change its structure later. If we got a fact wrong through our own mistake, tell us and we correct that specific fact only. Otherwise, the document remains exactly as we sent it to you initially.

15. Paid work is separate
If you want paid work later, it is a new and separate agreement with its own written scope and terms. Nothing in the free read-out is a price, a quote, or a promise of what paid work would include. The free audit and any future paid work are two different things entirely.

[S3] Your part is true details, a kept call, and respect for what each side owns

D. WHAT WE NEED FROM YOU

16. The read-out rests on what you share
We may send a short set of questions before the call. If the information you give is incomplete or wrong, the read-out will be too. We are not responsible for that gap.

17. Giving false details ends the audit
This applies if you use a false company name, state a false role, or hide that you work for a competing studio or consultancy.

E. MOVED, MISSED OR LATE CALLS

18. To move the call, tell us at least 24 hours before
You can move it once. After that, the place goes to the next on the list.

19. If you do not join and did not tell us
We wait 15 minutes. Then the call is closed and the place passes to the next on the list.

20. If you join late
The call still ends at its booked time.

21. If we need to move the call
We tell you as early as we can and offer a new time. You keep your place.

F. WHO OWNS WHAT

22. You keep your read-out
You may use it for your own business. You may share it inside your company and with your own advisers, such as your accountant or lawyer.

23. Our tools stay ours
Our questions, the way we structure the read-out, our templates, scoring and working tools stay the property of FlowState Impact. Receiving a read-out gives no right to them.

24. You may not sell or publish the read-out
It may not be sold, posted publicly, used to train software, presented as your own work, or used to give the same service to others.

25. Using our name needs permission
Using our name, the read-out or quotes from it in marketing or the press needs our written permission first.

26. No recording without agreement
No recording or sharing of the call unless both sides agree first. This includes AI note-taking tools and meeting bots. We take our own written notes.

[S4] You owe us nothing, your details stay private, and any ending or change is told to you

G. ADVICE, RESPONSIBILITY AND NO OBLIGATION

27. The audit is not legal, financial, tax or accounting advice
The call and read-out give our view on your business. They do not replace professional advice. For those specific areas, speak to a qualified professional.

28. The read-out reflects our honest view
The read-out is our honest view on the day it is written. We promise no result from following it. We are not responsible for decisions you make or losses that follow, as far as the law allows. Nothing here removes rights that the law says cannot be removed.

29. You owe us nothing and we do not chase you
You owe us nothing and are under no obligation to buy anything. We are under no obligation to offer paid work. We may tell you once what paid work would look like. We will not chase you, and nothing renews or charges automatically.

H. PRIVACY

30. Your details stay within the studio
What you share is used only to prepare your audit. We do not share it outside the studio, except where the law requires it. This also applies to a trusted contractor who works for us under the same duty of privacy.

31. We ask before using your story
If we want to use a lesson from your audit with your name and details removed, for example in an article, we ask you first in writing. Using your name or company in a case study needs a separate written yes.

32. Audit material is deleted after twelve months
We keep audit material for 12 months, then delete it, unless you become a paid client. Data protection rights you have where you live still apply.

33. We do not add you to mailing lists
We do not add you to a mailing list unless you say yes.

I. WHEN WE MAY DECLINE, PAUSE OR END AN AUDIT

34. We tell you if a rule is broken
We may decline, pause or end an audit when a rule here is broken: false details (17), working for or applying for a competing studio (5), recording or sharing without agreement (26), resale or misuse of the read-out (24), or rude, threatening or abusive behaviour towards anyone in the studio. When we do, we tell you which rule was broken.

35. We cannot use private client information
If running your audit would mean using what another client told us in private, we tell you and cannot run it. You keep your place on the list if the conflict ends while the offer is open.

J. GENERAL

36. Changes to the offer are posted here
We may change or end the offer. Changes are posted on this page with the date. A change never takes away a place already confirmed, or the call and read-out already promised to someone holding one.

37. These terms are the whole agreement
These terms and your booking confirmation are the whole agreement for the audit. If one clause turns out not to be valid, the rest still stand.

38. Disputes follow Bangladeshi law
These terms follow the law of Bangladesh, and the courts of Dhaka decide any dispute. Before going to court, both sides first try to settle a problem in writing for 30 days.

39. Contact us with questions
Questions about these terms go to CONTACT_EMAIL. Last updated: LAST_UPDATED.