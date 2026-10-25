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
 "title": "Terms of the free audit",
 "reader": {
  "who": "A small business owner in Dhaka or London who has never met the studio, reading on a phone, maybe in a second language, after tapping the star beside \"Free for a limited time\".",
  "decides": "Whether to apply for a free audit, and, once they hold a place or a waiting-list position, how to act so nothing surprises them later.",
  "lacks": [
   "The audit is one video call of up to 60 minutes and one written read-out sent within 10 working days, and nothing beyond that is included.",
   "The 10 places go strictly in the order complete applications arrive, and a position on the waiting list promises nothing.",
   "They owe nothing, are under no obligation to buy anything, and the studio will not chase them."
  ]
 },
 "register_notes": "Measured professional in form and child-clear in meaning: complete sentences, short paragraphs, and every legal idea said in everyday words, so a reader on a phone, perhaps in a second language, understands each clause in one pass. The voice is a calm host explaining the house rules, never a guard reading out penalties; it does not praise the studio, sell, joke or reach for a slogan. Every clause keeps its number and its order, opens with its fixed heading from the glossary, and runs one to three sentences where the facts allow; where a clause carries more facts than that, keep every fact in short sentences, and clause 34 may set out its five rules as a short numbered list. When a clause points to another, give the number and the fixed heading, for example: clause 34 (Five rules, and what happens when one is broken).",
 "glossary": {
  "we, us, the studio": "FlowState Impact, registered in Dhaka, Bangladesh; never 'the Company', 'the Provider' or any legal-form wording.",
  "you": "the person reading and applying, and the company they apply for; never 'the Client' or 'the Applicant' as a capitalised party.",
  "the audit": "the free offer itself: one call of up to 60 minutes by video and one written read-out; never 'consultation', 'session' or 'assessment'.",
  "the call": "the one video call of up to 60 minutes; always 'the call'.",
  "the read-out": "the written letter about your business that we send by email after the call; always 'the read-out', never 'report', 'deliverable' or 'draft'; 'letter' appears only in its definition.",
  "a place": "one of the 10 free audits; holding a place means you will get the call and the read-out.",
  "the waiting list": "the line of people who have applied but do not yet hold a place; being on it is not a place.",
  "the confirmation email": "the email of clause 7, sent within 2 working days; with these terms, the only document that forms part of the agreement; never 'booking confirmation'.",
  "a complete application": "the form is filled in and your contact details work (clause 7).",
  "the offer": "the free audit offer, for a limited time, with no fixed end date (clause 10).",
  "working days": "Sunday to Thursday, not counting public holidays in Bangladesh (clause 12).",
  "a competing studio": "a business that sells branding, design or business consulting to other companies (clause 5).",
  "the five rules": "the five rules listed in clause 34, the only reasons we may take an application off the waiting list, or pause or end an audit.",
  "a pause": "a hold used while we check something; during it you keep your place (clause 34).",
  "a conflict of interest": "running your audit would mean using what another client told us in private (clause 35).",
  "these terms": "this page; never 'this Agreement' or any capitalised legal label.",
  "clause headings": "Use these exact words as each clause's own heading, and in every cross-reference after the clause number: 1 One free audit for each company, once · 2 Companies with the same owner, group or management count as one · 3 No second application under another name · 4 The owner, a director or someone the owner allows must apply · 5 People from competing studios cannot take part · 6 Places go in the order complete applications arrive · 7 The confirmation email arrives within 2 working days · 8 Your place belongs to your company · 9 A freed place goes to the first person on the waiting list · 10 The offer ends after the tenth call, or when we end it · 11 One call and one written read-out · 12 Working days run Sunday to Thursday · 13 We do not carry out the work the read-out suggests · 14 The read-out is finished, not a draft · 15 Paid work is a separate agreement · 16 The read-out rests on what you share · 17 False details break these terms · 18 You can move your call once, with 24 hours' notice · 19 A missed call closes after 15 minutes · 20 A late start still ends at the booked time · 21 If we move the call, you keep your place · 22 You keep your read-out · 23 Our methods stay ours · 24 You may not resell, publish or pass off the read-out · 25 Our name or the read-out in marketing or the press needs our written permission · 26 No recording or sharing of the call unless both sides agree · 27 This is not legal, financial, tax or accounting advice · 28 Your decisions are yours · 29 You owe us nothing, and we will not chase you · 30 Only the people preparing your audit see what you share · 31 We ask in writing before using a lesson from your audit · 32 We keep audit material for 12 months, then delete it · 33 No mailing list unless you say yes · 34 Five rules, and what happens when one is broken · 35 Your audit waits while a conflict of interest lasts · 36 We may change or end the offer, but a place already held is kept · 37 These terms and your confirmation email are the whole agreement · 38 Bangladesh law applies, and we talk before going to court · 39 Where to send questions about these terms"
 },
 "never": [
  "Never mention Akij.",
  "Never describe the legal form of the business (no sole trader, limited company or any legal-form wording), and never give a registration number or a street address.",
  "Never say or hint that the studio chooses, judges or declines who gets a place: no shortlisting, curating, selecting, declining, 'successful applicants'. Arrival order is the only thing that decides.",
  "Never use these words: hereinafter, shall, notwithstanding, the Client, decline, trusted, booking confirmation, select, shortlist, curate, certainly, leverage, seamless, journey, unlock, empower, elevate, solution, robust, innovative, passionate, worth, ultimately, in conclusion; and no legal Latin of any kind.",
  "Never use em dashes, and never write a sentence in capital letters; only the page headings given in the facts are in capitals.",
  "Never use penalty or court words such as forfeit, penalty, violation, liable party or breach of contract; say what happens in everyday words.",
  "Never accuse the reader or guess at bad motives: never write 'free consulting', and never warn that people try to misuse the offer.",
  "Never add a number, date, deadline, price, promise, party, tool name or service name that is not in the facts: no named video platform, no named email or file storage service, no price for paid work, no end date for the offer.",
  "Never promise a place to anyone on the waiting list, and never say what the audit will cost after the offer ends.",
  "Never fill in CONTACT_EMAIL or LAST_UPDATED; write both tokens exactly as they are.",
  "Never write a clause that belongs to another section, and never renumber, merge, split, reorder or drop a clause or its number.",
  "Never praise or sell the studio, never add a call to apply, and never end a section with a summary, a recap or 'in short'.",
  "Never name London, the UK or any country other than Bangladesh; clause 38 says 'your own country' and nothing more."
 ],
 "sections": [
  {
   "n": 1,
   "heading": "You get one free call and one written read-out, and each company gets one",
   "purpose": "After it, the reader can say back the whole deal in one breath (one free call, one written read-out, places in order, one per company, nothing owed), knows the five words the page uses, and knows whether they are allowed to apply.",
   "hand_off": "Section 2 sets out how the 10 places are given out, strictly in order, and exactly what the audit does and does not include."
  },
  {
   "n": 2,
   "heading": "Places go in order, and the audit stops at one call and one read-out",
   "purpose": "After it, the reader understands that the 10 places go strictly in the order complete applications arrive, that the waiting list promises nothing, and that the audit is one call and one finished read-out, never the start of ongoing unpaid work.",
   "hand_off": "Section 3 turns to what the reader brings: honest details, keeping to the call, and respecting what they may do with the read-out."
  },
  {
   "n": 3,
   "heading": "Share honest details, keep your call time, and keep the read-out for your own business",
   "purpose": "After it, the reader knows the read-out is only as good as what they share, how moving, missing or joining a call late affects their place, and what they may and may not do with the read-out and the call.",
   "hand_off": "Section 4 says where responsibility for decisions sits and who sees what the reader shares, and for how long."
  },
  {
   "n": 4,
   "heading": "The decisions stay yours, and what you share stays with our team",
   "purpose": "After it, the reader knows the read-out is an honest view and not professional advice, that they owe nothing and will not be chased, and exactly who sees what they share, how it may be used and how long it is kept.",
   "hand_off": "Section 5 sets out what happens when a rule is broken, and the general terms that hold the whole agreement together."
  },
  {
   "n": 5,
   "heading": "Breaking one of five rules can end an audit, and these terms follow Bangladesh law",
   "purpose": "After it, the reader knows the five rules that can end an audit and how they will be told, what a conflict of interest means for their turn, how the offer can change or end without taking away a held place, which law applies and how a dispute starts, and it closes on clause 39, so their one next step, if anything is unclear, is to write to CONTACT_EMAIL.",
   "hand_off": "None: this is the end of the page, and it closes on the contact line of clause 39 with no summary after it."
  }
 ]
}

WHAT THE MECHANICAL SCANS FOUND (the prose gate on the whole draft, then repetition across sections):

- advisory: four or more sentences in a row at nearly the same length (the metronome tell). Cut one to six words or let one run long.
- advisory: 15 sentences start with "you"; vary the openings.
- sections 3, 4 all open with "the read out ..."
- the phrase "on the waiting list" appears in sections 1, 2, 3, 5
- the phrase "the read out is" appears in sections 1, 2, 4
- the phrase "you keep your place" appears in sections 2, 3, 5

THE DRAFT, with section markers:

[S1] You get one free call and one written read-out, and each company gets one

THE SHORT VERSION

You get one free call and one written letter about your business. It costs you nothing, and you do not have to buy anything afterwards. There are ten places, and they go in the order complete applications arrive. One company gets one place, no matter how many people work there. If you are on the waiting list, you are not promised a place yet.

WORDS USED ON THIS PAGE

We, us, and the studio mean FlowState Impact, registered in Dhaka, Bangladesh. A place means one of the ten free audits. Holding a place means you will get the call and the read-out. The read-out is the written letter about your business that we send after the call. The waiting list is the line of people who have applied but do not yet hold a place. Being on it is not a place.

A. WHO CAN TAKE PART

1 One free audit for each company, once
Each company can take part in this offer one time. Once your company has had its audit or lost its place, you cannot apply again.

2 Companies with the same owner, group or management count as one
If several companies share the same owner, group, or management team, they count as one company for this offer. They do not get separate places.

3 No second application under another name
A company that has already applied cannot try again under a new name or through another person. The studio knows who has applied.

4 The owner, a director or someone the owner allows must apply
The person filling in the form must be the owner, a director, or someone the owner has allowed to apply and share business details. This ensures the right people are involved.

5 People from competing studios cannot take part
If you run or work for a business that sells branding, design, or business consulting to other companies, you cannot take part. This includes applying on behalf of your own clients. If this comes to light later, clause 34 (Five rules, and what happens when one is broken) applies. We may end the audit and tell you why.

The call lasts up to 60 minutes and happens by video. The read-out arrives by email within 10 working days after that call. Working days run Sunday to Thursday, not counting public holidays in Bangladesh. You are under no obligation to buy anything, and we will not chase you.

[S2] Places go in order, and the audit stops at one call and one read-out

B. THE WAITING LIST

There are 10 places. They go to complete applications based on the date and time we receive them. First come, first served is the only rule that decides the order. Nothing else matters. An application is complete when the form is filled in and your contact details work. Within 2 working days, we send you the confirmation email. It tells you one of two things: that you hold a place, or your position on the waiting list. If you hold a place, that same email thread gives the date, time, and form of your call.

A place belongs to your company. It cannot be sold, swapped, or handed to another business. It cannot be exchanged for money, a discount, or any paid alternative. Once all 10 places are held, new applicants join the waiting list in order. If a place frees up, it goes to the first person on that list. A place frees up when someone withdraws, misses the call under clause 18 or 19, or loses the place under clause 34. The first person on the list is told by email. Being on the waiting list does not promise a place. It is simply a line of people who have applied but do not yet hold a spot.

The offer is for a limited time, with no fixed end date. It ends at the first of two moments: when the tenth call has taken place, or when we end the offer under clause 36. A place counts as used once its call has taken place. If a place frees up before its call, it goes back to the waiting list under clause 9. When the offer ends, the waiting list closes. Everyone still on it is told by email within 5 working days. Their position ends then. It does not carry over to any later offer unless we say so in writing. People who already hold a place keep it, as stated in clause 36.

C. WHAT YOU GET, AND WHAT YOU DO NOT

The audit is one call of up to 60 minutes, by video. It includes one written read-out. We send the read-out by email within 10 working days after the call. Working days are Sunday to Thursday. We do not count public holidays in Bangladesh when calculating this time. If something outside our control delays the read-out, we tell you and give a new date.

We do not carry out any of the work the read-out suggests. There is no design, writing, building, or strategy work included. You will not get extra calls, unlimited follow-up questions, or rewriting of the read-out. You may send one email of questions about the read-out within 14 days of receiving it. We answer that email once. That is the limit of our support on this topic.

The read-out is a finished document. It is not a draft. We do not rewrite it to match a view you prefer. If we got a fact wrong because of a mistake on our side, tell us and we correct that fact. This is the only change we make after sending it. If you later want paid work, it is a new and separate agreement. Nothing in the read-out is a price, a quote, or a promise of what paid work would include. Paid work has its own written scope and terms. It stands apart from this free audit entirely.

Honest details form the basis of the read-out. What you share with us during the call becomes the foundation for the written advice. If those details are false, these terms are broken. You can move your call once, provided you give 24 hours' notice. A missed call closes after 15 minutes. If you start late, the call still ends at the booked time. If we need to move the call, you keep your place. You keep your read-out. Our methods stay ours.

[S3] Share honest details, keep your call time, and keep the read-out for your own business

The read-out rests on what you share. We may send a short set of questions before the call. If the information is incomplete or wrong, the read-out will be too. We are not responsible for that outcome. Clause 16 (We need honest, complete information, and the read-out rests on what you share) sets this out.

False details break these terms. This includes a false company name, a false role, or hiding that you work for a competing studio. If we find false details, clause 34 (Five rules, and what happens when one is broken) applies. We may take the application off the waiting list, or pause or end the audit. We tell you why. An honest mistake that you correct when we ask is not a false detail.

If you need to move the call, tell us at least 24 hours before. You can move it once. After that, the place goes to the next person on the waiting list. Clause 18 (You can move your call once, with 24 hours' notice) covers this rule.

If you do not join the call and did not tell us, we wait 15 minutes. Then the call is closed. The place passes to the next person on the waiting list. Clause 19 (A missed call closes after 15 minutes) explains what happens in that case.

If you join late, the call still ends at its booked time. Clause 20 (A late start still ends at the booked time) keeps the schedule fixed for everyone.

If we need to move the call, we tell you as early as we can. We offer a new time. You keep your place. Clause 21 (If we move the call, you keep your place) ensures your spot is safe.

You keep the read-out for your own business use. You may share it inside your company. You may also share it with your own advisers, for example your accountant or lawyer. Clause 22 (You keep your read-out) defines who can see it.

Our methods stay ours. The questions we ask, how we structure the read-out, our templates, scoring and working tools remain the property of FlowState Impact. Receiving a read-out does not give you any right to them. Clause 23 (Our methods stay ours) protects this work.

You may not resell, publish or pass off the read-out. It cannot be sold. It cannot be posted publicly. It cannot be used to train software. It cannot be presented as your own work. It cannot be used to deliver the same service to others. Clause 24 (You may not resell, publish or pass off the read-out) lists these limits.

Using our name, the read-out or quotes from it in marketing or the press needs our permission in writing first. Clause 25 (Our name or the read-out in marketing or the press needs our written permission) requires this step.

No recording or sharing of the call unless both sides agree first. This includes AI note-taking tools and meeting bots that join the call. We take our own written notes. Clause 26 (No recording or sharing of the call unless both sides agree) covers the privacy of the conversation.

[S4] The decisions stay yours, and what you share stays with our team

The read-out is an honest view on the day it is written. It is not legal, financial, tax or accounting advice. For those areas, speak to a qualified professional. Clause 27 (This is not legal, financial, tax or accounting advice) sets this limit clearly.

Your decisions are yours alone. We do not promise any result from following the read-out. We are not responsible for decisions you make or losses that follow from it, as far as the law allows. Nothing here removes rights that the law says cannot be removed. Clause 28 (Your decisions are yours) keeps this boundary firm.

You owe us nothing for the audit. You are under no obligation to buy anything. We are also under no obligation to offer you paid work. We may tell you once what paid work would look like. We will not chase you. Nothing renews or charges automatically. Clause 29 (You owe us nothing, and we will not chase you) ends the pressure here.

What you share is seen only by the people who prepare your audit. We use it only to prepare your audit. The people who see it are our own team. We pass it to nobody else. There is one exception. When the law requires us to share it, we tell you, unless the law forbids telling. Clause 30 (Only the people preparing your audit see what you share) defines this circle of trust.

If we want to use a lesson from your audit, we remove your name and details first. This might happen in an article. We ask you first in writing. Using your name or company in any case study needs a separate written yes. Clause 31 (We ask in writing before using a lesson from your audit) protects your identity by default.

Your personal details are handled under our privacy notice. We keep audit material for 12 months, then delete it. This changes if you become a paid client. Clause 32 (We keep audit material for 12 months, then delete it) sets the timeline for deletion.

We do not add you to a mailing list unless you say yes. Clause 33 (No mailing list unless you say yes) respects your inbox.

The rules above keep your information safe and your choices free. The next part covers what happens if a rule is broken, and the general terms that hold the whole agreement together.

[S5] Breaking one of five rules can end an audit, and these terms follow Bangladesh law

When one of five rules is broken, we may take an application off the waiting list, or pause or end an audit. This is the only clause that says what happens after a rule is broken; clauses 5, 17, 24 and 26 point here. The five rules are false details, working for or applying for a competing studio, recording or sharing the call without agreement, reselling, publishing or misusing the read-out, and rude, threatening or abusive behaviour towards anyone in the studio. We use this power for these five reasons only, never for any other. We tell you in writing which rule was broken. A pause is used while we check something; during a pause you keep your place, and we tell you when we will decide. If an audit ends before its call, the place goes to the first person on the waiting list (clause 9).

A conflict of interest means that running your audit would mean using what another client told us in private. If that happens, we tell you that we cannot run your audit while the conflict lasts. You keep your position on the waiting list, and if the conflict ends while the offer is still open, your audit goes ahead in its turn.

We may change or end the offer. Changes are posted on this page with the date. If we end the offer, the waiting list closes as clause 10 describes. A change or an ending never takes away a place already held, or the call and read-out already promised to someone holding one.

These terms and your confirmation email (clause 7) are the whole agreement for the audit. That means nothing said in a chat, a call or another message adds to them. If one clause turns out not to be valid, the rest still stand.

These terms follow the law of Bangladesh, and the courts of Dhaka decide any dispute. If a problem arises, both sides first try to settle it by talking, in writing, for 30 days. Only if that fails does it go to the courts of Dhaka. This does not take away any right that the law of your own country gives you and does not allow to be taken away.

Questions about these terms go to CONTACT_EMAIL. Company: FlowState Impact, Dhaka, Bangladesh. Last updated: LAST_UPDATED.