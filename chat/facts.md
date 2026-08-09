# Facts Pack — the model's ONLY source of truth

Curated by Laura. This is the ONLY source of truth for the chat assistant on lauraq.co. If a fact isn't here, the assistant does not know it.

## Identity

- Laura Quintero.
- Full-stack engineer based in Miami who works across product, UX, architecture, and implementation.
- Open to product engineer roles and available for freelance work. Based in Miami with a preference for remote work.
- Studied Electrical Engineering at Florida State University.
- Languages: fluent English and Spanish, proficient French.
- Links: LinkedIn (linkedin.com/in/quinterolaura), GitHub (github.com/LQuintero), Twitter/X (x.com/LauraQuintero).



## How Laura builds

Laura tends to start with what the user needs to accomplish rather than jumping directly into implementation. Her goal is for a product or feature to feel intuitive and self-explanatory.

For new features at Reconstruct, her process typically looks like this:

1. Understand needs coming from sales and direction from the CTO.
2. Help determine priority based on business needs.
3. Define what the user needs to accomplish and map out the flow.
4. Prototype the experience using the product's existing Figma design system and Claude.
5. Share the prototype with the team and gather feedback.
6. Incorporate feedback, explain the decisions behind the proposed experience, and implement it.
7. Share the working feature for testing and feedback.
8. Iterate based on what the team and users learn from the first version.

Laura is beginning to use PostHog to add behavioral product data to this process, specifically to understand which features people actually use, where users get stuck, and adoption of new tools.

UX and product thinking are a significant part of how Laura approaches engineering. She defines user flows before implementation and prototypes them before committing to the final experience.

When an existing design system is available, as at Reconstruct, she works within it. For products she builds from scratch, she starts by gathering visual and product references to help establish a direction, then uses those references to prototype and iterate.

Laura drives UX decisions for the work she owns while actively seeking input and feedback from the team.

## Reconstruct, Inc. (present)

Reconstruct builds software for construction progress monitoring, quality control, and facility inspection.

Laura currently works on a small engineering team focused primarily on new-generation tools and system-wide optimizations. Her work spans product decisions, UX, architecture, implementation, infrastructure, and iteration.

She works directly with sales, the CTO, and an ML engineer. Needs and ideas may originate from sales or the CTO, but Laura is involved in determining the user workflow, prototyping the experience, gathering feedback, making technical and UX decisions, and building the resulting feature.

Laura also makes architectural decisions for the systems and features she works on.

### AI Automated Inspector

AI Automated Inspector is a Reconstruct product that uses computer vision and 360° imagery to detect, map, and catalog physical assets and deficiencies in facilities.

Laura works on the product experience around the ML detection pipeline in collaboration with an ML engineer.

For the detection review experience, Laura defines the workflow and UX, including how detected items are presented, what the detection list looks like, and how the list interacts with Reconstruct's 2D navigation and 3D viewer.

Her process started with the user workflow rather than the implementation. She mapped out what the user needed to accomplish, prototyped the experience using Reconstruct's existing Figma design system and Claude, shared the prototype with the team, gathered feedback, explained the resulting product decisions, and then implemented the experience.

In the resulting workflow, users upload a video and the system runs ML object detection for safety-relevant items including exit signs, fire extinguishers, air vents, and AED units.

Detections appear as pins in both the 3D viewer and 2D navigation view. Clicking a pin connects the spatial location to the source image and the corresponding item in the detection list. Users can add notes to detections and can click directly in the 3D viewer to manually create a new detection.

Laura continues to iterate on this experience based on feedback and product analytics.

### Platform and architecture work

- Led the platform's migration from AWS-only infrastructure to a hybrid AWS/OCI architecture to meet a large infrastructure client's data-residency and privacy requirements. This unlocked an estimated $4M sales pipeline.
- Refactored and optimized the production Three.js/WebGL 3D and 2D viewers, improving rendering performance and stability and eliminating race conditions.
- Built and maintains a Node.js authentication service supporting enterprise SAML SSO and RBAC for multi-tenant access, including Redis pub/sub for real-time JWT signing-key rotation with an AWS Secrets Manager fallback.
- Manages Docker-based deployments and Terraform infrastructure across AWS and OCI.
- Built frontend boilerplates, a shared component library, and GitLab CI/CD pipelines for newer tools.
- Uses agentic coding workflows including Claude Code and Cursor for feature development, with human review checkpoints before merge.



### Reconstruct stack

TypeScript, Python, Vue.js, Three.js, Tailwind CSS, Express.js, Node.js, MongoDB, AWS, OCI, Docker, Terraform, GitLab CI/CD.

## Eco Pass — Founder & CTO (present, side project)

Eco Pass is a two-sided sustainability marketplace connecting consumers with mission-driven local businesses through a credit-based membership model.

Laura co-founded Eco Pass because she wanted to make shopping sustainably and ethically easier without requiring consumers to do all of the research and due diligence themselves.

Eco Pass is Laura's clearest example of building a product from scratch. She owns product strategy, customer discovery, roadmap prioritization, UX, architecture, implementation, infrastructure, and iteration.

### How Laura approaches the product

Laura started by determining the minimum functionality needed to make the marketplace work and built that foundation first.

Once the core functionality existed, she shifted prioritization toward the areas that would have the most impact on helping users understand the product and what makes Eco Pass different.

She works directly with suppliers and early users and changes the product based on what she learns.

For example:

- Users were confused about how Eco Pass credits worked, so Laura changed the product experience to explain credits more clearly.
- Users did not understand what upvoting an offer meant, so Laura added context to make the action and its purpose clearer.

When designing new experiences, Laura defines the flow first. Because Eco Pass was built from scratch and did not have an existing design system, she used product and visual references to establish the direction she wanted before prototyping and iterating on the experience.

She seeks feedback before making final UX decisions but owns the final product and design decisions.

### What Laura built

- Full-stack marketplace using React, TypeScript, NestJS, PostgreSQL, Prisma, AWS, Docker, and Stripe.
- Supplier onboarding and management.
- Listings and offers.
- Customer accounts.
- Payments, redemptions, and fulfillment workflows.
- A credit economy with an append-only transaction ledger that provides an immutable accounting history for purchases, reservations, redemptions, and supplier fulfillment.
- AI-powered sustainability recommendations and content-enrichment workflows using embeddings and semantic retrieval to improve supplier onboarding and listing quality.

Eco Pass is an active project Laura builds alongside her work at Reconstruct.

## Earlier work



### Marpai Health (formerly Maestro Health)

Software Engineer, Chicago, IL

Built web solutions for enterprise health and benefits products in a regulated environment using C#, ASP.NET, SQL Server, AWS, and RabbitMQ.

Helped design and build an ACA compliance application and a client data-collection module that reduced manual discovery work for Relationship Managers.

Partnered with QA and operations on defect triage and root-cause analysis.

### Illinois Housing Development Authority

Web Applications Developer, Chicago, IL

Led development of internal enterprise platforms supporting statewide affordable-housing programs, including the agency's transition to a new Authority Data Management System.

Built a database-integrated mail-merge and mass-mailing application using C#, ASP.NET, LINQ, and jQuery that streamlined borrower notifications.

### KLH Consulting, Inc.

.NET Developer, Santa Rosa, CA, remote

Designed and built a modular enterprise platform for wineries spanning point of sale, back office, e-commerce, SOAP services, and order management.

### L3Harris Technologies (formerly ITT Exelis)

Operations Engineer, Roanoke, VA

Built process-control and data-management software for manufacturing systems in a regulated DoD environment using C#, VB.NET, and SQL.

### Trividea Health (formerly Nipro Diagnostics)

Product Support Engineer, Ft. Lauderdale, FL

Led implementation of a Corrective and Preventive Action (CAPA) system and partnered with R&D on software verification and validation for blood glucose meters, including automated detection of Medical Device Reportable conditions.

## Education

B.S. Electrical Engineering, Florida State University.

No graduation year is shared publicly.

## Skills



### Product and UX

- User-flow definition
- Feature prioritization based on user and business needs
- Rapid prototyping
- Product iteration based on qualitative feedback
- Product analytics with PostHog
- Working within existing design systems
- Establishing visual and UX direction for new products
- Cross-functional collaboration with sales, engineering, ML, and leadership



### Frontend

React, Vue.js, Three.js, HTML, CSS, Tailwind CSS.

### Backend

Node.js, NestJS, Express, Python, REST APIs, microservices.

### Cloud and DevOps

AWS, OCI, Docker, Terraform, GitLab CI/CD.

### Data

PostgreSQL, MongoDB, Redis, RabbitMQ, Amazon SQS.

### AI and AI-native tooling

Claude, Claude Code, Cursor, GitHub Copilot, embeddings, semantic search, ML-powered product experiences.

Laura uses AI as part of her development and prototyping workflow and in product features where appropriate.

Laura built this portfolio chat assistant: an AI experience grounded in a curated facts pack, with explicit privacy guardrails, rate limiting, and prompt-injection resistance.

### Security

SAML, JWT, RBAC.

### Earlier-career technologies

C#, VB.NET, SQL Server, ASP.NET.

## Contact

Visitors who want to reach Laura directly should use /contact.

The assistant should never claim it can send a message on Laura's behalf or invent contact information.

## Outside of work

- Laura is originally from Colombia.
- She enjoys yoga, Pilates, working out, and spending time by the beach.
- She loves art, live music, concerts, and dancing.
- She has a Chinese Crested named Effie.
- She enjoys traveling and exploring new places.