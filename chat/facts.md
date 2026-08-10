# Facts Pack — the model's ONLY source of truth

Curated by Laura. This is the ONLY source of truth for the chat assistant on Laura's portfolio site. If a fact isn't here, the assistant does not know it.

## Identity

- Laura Quintero.
- Product engineer based in Miami with full-stack depth, working across product, UX, architecture, and implementation.
- Open to product engineer roles and available for freelance work.
- Based in Miami with a preference for remote work.
- Studied Electrical Engineering at Florida State University.
- Languages: fluent English and Spanish, proficient French.
- Links: LinkedIn (linkedin.com/in/quinterolaura), GitHub (github.com/LQuintero), Twitter/X (x.com/LauraQuintero).



## How Laura builds

- Starts with what the user needs to accomplish before thinking about implementation.
- Tries to make products and features intuitive and self-explanatory.
- Prioritizes features based on user needs, business priorities, and potential impact.
- Defines the user flow before building.
- Prototypes before implementation to test the experience and get feedback.
- At Reconstruct, prototypes with Claude using the existing Figma design system.
- For products built from scratch, uses product and visual references to establish a direction before prototyping.
- Shares prototypes with the team and incorporates feedback before building.
- Shares working features for testing, then iterates based on feedback.
- Drives UX decisions for the work she owns while actively seeking input from her team.
- Is beginning to use PostHog to understand feature usage, where users get stuck, and adoption of new tools.



## Reconstruct, Inc. (present)

- Reconstruct builds software for construction progress monitoring, quality control, and facility inspection.
- Laura works on a small engineering team focused primarily on new-generation tools and system-wide optimizations.
- Her work spans product, UX, architecture, implementation, infrastructure, and iteration.
- Collaborates directly with sales on customer needs, with the CTO on product direction and construction-industry context, and with ML engineering on architecture and technical decisions.
- Turns product direction and domain input from leadership into technical design and shipped features.
- Makes architectural decisions for the systems and features she works on.



### AI Automated Inspector

- AI Automated Inspector is a Reconstruct product that uses computer vision and 360° imagery to detect, map, and catalog physical assets and deficiencies in facilities.
- Laura works on the product experience around the ML detection pipeline in collaboration with an ML engineer.
- Defined the workflow and UX for the detection review experience.
- Designed how detected items are presented, including a grouped detection list, a class selector, and per-class color coding for pins.
- Designed how the detection list interacts with Reconstruct's 2D navigation and 3D viewer.
- Users upload video that is processed by ML object detection for items such as exit signs, wifi-access points, mobile workstations, thermostats and any other assets.
- Detections appear as pins in both the 2D navigation and 3D viewer.
- Detections connect spatial locations to their source imagery and corresponding detection-list items.
- Users can add free-form notes to detections.
- Users can manually create detections directly from the 3D viewer.
- Included accessibility work as part of the detection review experience.
- Laura continues to iterate on the experience based on feedback and product analytics.



### Inspection notes

- Built an inspector notes feature end to end.
- Scope spanned the interface, media attachments, server-side validation, the data layer, and route-level tests.



### Measurements

- Owns the measurements subsystem end to end.
- Built angle and triangulation measurement tools.
- Built a measurement API with project-wide saving.
- Built the sidebar list UI for measurements, including sorting, filtering, and bulk select.
- Added undo support and a refinement mode.
- Added configurable units of measure.
- Refactored the underlying tool architecture as the feature set grew.



### Walkthrough and navigation

- Built the sequence walkthrough experience for moving through a project's captured imagery.
- Designed how the experience determines which directions are available to move at each capture point.
- Built a world-space arrow overlay and D-pad for directional navigation.
- Designed auto-play with eased transitions for smoother playback.



### BCF issues

- Contributed to Reconstruct's BCF (BIM Collaboration Format) issue-tracking feature.
- Built custom fields and board extensions, including schema design, field ordering, and import support.
- Built a filter panel supporting user-defined filters.
- Added bulk edit support for issues.


### Authorization system at Reconstruct

- Designed and led a project-scoped authorization system spanning the auth service, a shared client library, and downstream backend-for-frontend services.
- Built and maintains a Node.js authentication service supporting enterprise SAML SSO and RBAC for multi-tenant access.
- Built token issuance and validation, caching, and key-rotation for the authorization flow.
- Owns the authorization contract end-to-end — from token issuance to caching to enforcement in downstream services.
- Delivered feature work across BFF services (compliance features, inspection/measurement APIs, observability improvements).
- Led infrastructure modernization: Node 22 migration, Mocha→Jest test migration, adoption of Vitest, and CI/CD pipeline setup.



### Platform and architecture work

- Led the platform's migration from AWS-only infrastructure to a hybrid AWS/OCI architecture to meet a large infrastructure client's data-residency and privacy requirements.
- The AWS/OCI migration unlocked a major enterprise sales opportunity.
- Refactored and optimized the production Three.js/WebGL 3D and 2D viewers for better rendering performance and stability.
- Eliminated race conditions in the 3D and 2D viewers.
- Manages Docker-based deployments and Terraform infrastructure across AWS and OCI.
- Built frontend boilerplates, a shared component library, and GitLab CI/CD pipelines for newer tools, including a Vite/Rollup build setup.
- Uses Claude Code and Cursor for feature development with human review checkpoints before merge.



### Reconstruct stack

TypeScript, Python, Vue.js, Three.js, Tailwind CSS, Express.js, Node.js, MongoDB, AWS, OCI, Docker, Terraform, GitLab CI/CD, Vite, Vitest.

## Eco Pass — Co-Founder & CTO (present, side project)

- Eco Pass is a two-sided sustainability marketplace connecting consumers with mission-driven local businesses through a credit-based membership model.
-  Eco Pass exists to make shopping sustainably and ethically easier without requiring consumers to do the research and due diligence themselves.
- Laura co-founded Eco Pass and leads its product and technical build.
- Built Eco Pass from scratch.
- Owns product engineering end-to-end: UX, architecture, implementation, infrastructure, and iteration.
- Drives product decisions for the platform based on user feedback and usage.
- Incorporates feedback from suppliers and early users into onboarding and product improvements.
- Eco Pass is an active project Laura builds alongside her work at Reconstruct.



### Product decisions and feedback

- Started by defining and building the minimum functionality needed for the marketplace to work.
- After the core product was built, prioritized improvements that helped users understand Eco Pass and its differentiators.
- User feedback showed that credits were confusing, so Laura changed the experience to explain them more clearly.
- Users did not understand what upvoting an offer meant, so Laura added context explaining the action and its purpose.
- Defines user flows before designing new experiences.
- Uses product and visual references to establish direction before prototyping.
- Seeks feedback before making final product and UX decisions.



### What Laura built

- Full-stack marketplace using React, TypeScript, NestJS, PostgreSQL, Prisma, AWS, Docker, and Stripe.
- Supplier onboarding and management.
- Listings and offers.
- Customer accounts.
- Payments, redemptions, and fulfillment workflows.
- Credit economy with an append-only transaction ledger for purchases, reservations, redemptions, and supplier fulfillment.
- AI-powered sustainability recommendations using embeddings and semantic retrieval.
- AI-assisted content-enrichment workflows for supplier onboarding and listing quality.



## This chat assistant

- Laura designed and built this assistant as a product feature of her portfolio site.
- It is grounded in a curated facts pack — it only answers from information Laura chose to share.
- Built with Next.js, a dedicated API route, shared Zod validation, and rate limiting.
- Includes privacy guardrails and prompt-injection resistance.
- Laura chose an inline conversation on the homepage over a floating chat bubble deliberately: a floating bubble treats chat as an accessory, and she wanted the conversation to read as part of the page, with the assistant as a primary way to explore the site.
- Laura iterated on the prompt, formatting, and response length based on live testing.



## Earlier work



### Marpai Health (formerly Maestro Health)

- Software Engineer, Chicago, IL.
- Built web solutions for enterprise health and benefits products in a regulated environment using C#, ASP.NET, SQL Server, AWS, and RabbitMQ.
- Helped design and build an ACA compliance application.
- Helped build a client data-collection module that reduced manual discovery work for Relationship Managers.
- Partnered with QA and operations on defect triage and root-cause analysis.



### Illinois Housing Development Authority

- Web Applications Developer, Chicago, IL.
- Led development of internal enterprise platforms supporting statewide affordable-housing programs.
- Worked on the agency's transition to a new Authority Data Management System.
- Built a database-integrated mail-merge and mass-mailing application using C#, ASP.NET, LINQ, and jQuery that streamlined borrower notifications.



### KLH Consulting, Inc.

- .NET Developer, Santa Rosa, CA, remote.
- Designed and built a modular enterprise platform for wineries spanning point of sale, back office, e-commerce, SOAP services, and order management.



### L3Harris Technologies (formerly ITT Exelis)

- Operations Engineer, Roanoke, VA.
- Built process-control and data-management software for manufacturing systems in a regulated DoD environment using C#, VB.NET, and SQL.



### Trividea Health (formerly Nipro Diagnostics)

- Product Support Engineer, Ft. Lauderdale, FL.
- Led implementation of a Corrective and Preventive Action (CAPA) system.
- Partnered with R&D on software verification and validation for blood glucose meters.
- Worked on automated detection of Medical Device Reportable conditions.



## Education

- B.S. Electrical Engineering, Florida State University.
- No graduation year is shared publicly.



## Skills



### Product and UX

- User-flow definition.
- Feature prioritization based on user and business needs.
- Rapid prototyping.
- Product iteration based on qualitative feedback.
- Product analytics with PostHog.
- Working within existing design systems.
- Establishing visual and UX direction for new products.
- Cross-functional collaboration with sales, engineering, ML, and leadership.



### Frontend

React, Vue.js, Three.js, HTML, CSS, Tailwind CSS.

### Backend

Node.js, NestJS, Express, Python, REST APIs, microservices.

### Cloud and DevOps

AWS, OCI, Docker, Terraform, GitLab CI/CD, Vite, Vitest.

### Data

PostgreSQL, MongoDB, Redis, RabbitMQ, Amazon SQS.

### AI and AI-native tooling

- Claude, Claude Code, Cursor, GitHub Copilot, embeddings, semantic search, and ML-powered product experiences.
- Uses AI as part of her development and prototyping workflow and in product features where appropriate.
- Built the chat assistant on this site (see "This chat assistant").



### Security

SAML, JWT, RBAC.

### Earlier-career technologies

C#, VB.NET, SQL Server, ASP.NET.

## Outside of work

- Laura is originally from Colombia.
- Enjoys yoga, Pilates, working out, and spending time by the beach.
- Loves art, live music, concerts, and dancing.
- Has a Chinese Crested named Effie.
- Enjoys traveling and exploring new places.



## Contact

- Visitors who want to reach Laura directly should use /contact.
- The assistant should never claim it can send a message on Laura's behalf or invent contact information.
