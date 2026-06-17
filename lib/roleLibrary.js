// Role Library containing 28 professionally written sample JDs across 10 domains
// and the Resume-to-Role Recommendation Engine.

export const roleLibrary = {
  "Software Development": [
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      keywords: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Tailwind CSS", "SASS", "Redux", "Webpack", "Vite", "RESTful APIs", "Responsive Design", "Git"],
      description: `We are looking for a skilled Frontend Developer to join our engineering team. You will be responsible for building the client-side of our web applications, translating UI/UX designs into high-quality code, and ensuring optimal user experience.

Key Responsibilities:
- Develop responsive web applications using HTML5, CSS3, JavaScript, and modern frameworks (React/Vue/Angular).
- Optimize applications for maximum speed, scalability, and cross-browser compatibility.
- Collaborate with UI/UX designers to implement design systems and visual assets.
- Integrate RESTful APIs and handle client-side state management.
- Write clean, maintainable, and well-documented code.

Requirements:
- Strong proficiency in JavaScript/TypeScript and CSS preprocessors (SASS/Tailwind).
- Professional experience with React or equivalent modern frameworks.
- Familiarity with build tools like Webpack, Vite, or Gulp.
- Solid understanding of Git version control.
- Good communication and collaboration skills.`
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      keywords: ["Node.js", "Express", "Python", "Django", "Flask", "Java", "Spring Boot", "SQL", "PostgreSQL", "MongoDB", "RESTful APIs", "GraphQL", "Docker", "Redis", "Git", "Microservices"],
      description: `We are looking for a Backend Developer to build and maintain the core logic, databases, and APIs of our web applications. You will ensure high performance, security, and responsiveness of the system.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable backend code.
- Design database schemas, write optimized SQL queries, and manage database migrations.
- Develop, secure, and document RESTful APIs and GraphQL endpoints.
- Integrate third-party services, webhooks, and payment gateways.
- Collaborate with frontend engineers to integrate user-facing elements.

Requirements:
- Proficiency in at least one backend language: Node.js (JavaScript/TypeScript), Python, Java, or Go.
- Experience with databases such as PostgreSQL, MySQL, or MongoDB.
- Solid understanding of server-side caching, microservices, and system design.
- Familiarity with containers (Docker) and REST/GraphQL API design principles.
- Strong troubleshooting and debugging skills.`
    },
    {
      id: "full-stack-developer",
      title: "Full Stack Developer",
      keywords: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Node.js", "Express", "SQL", "MongoDB", "PostgreSQL", "RESTful APIs", "Docker", "AWS", "Git", "Tailwind CSS"],
      description: `We are seeking a versatile Full Stack Developer to handle both frontend and backend development. You will participate in the entire application lifecycle, from conceptualization and system design to deployment and maintenance.

Key Responsibilities:
- Build interactive user interfaces with React, HTML5, and Tailwind CSS.
- Develop secure, scalable backend servers using Node.js, Express, or Python.
- Model databases and write efficient queries in SQL or NoSQL databases.
- Design, implement, and consume RESTful APIs.
- Deploy applications to cloud environments and maintain CI/CD pipelines.

Requirements:
- Strong frontend skills (HTML, CSS, JavaScript, React) combined with backend proficiency (Node.js/Express).
- Experience working with databases like PostgreSQL, MySQL, or MongoDB.
- Basic understanding of DevOps, Docker, and cloud platforms like AWS.
- Strong problem-solving skills and ability to work independently or in a team.
- Version control experience with Git.`
    },
    {
      id: "react-developer",
      title: "React Developer",
      keywords: ["React", "React Native", "Redux", "Context API", "Hooks", "JavaScript", "TypeScript", "HTML5", "CSS3", "Next.js", "Tailwind CSS", "Jest", "Vite", "Git"],
      description: `We are seeking a dedicated React Developer specializing in building high-performance user interfaces. You will focus on building reusable React components, managing complex client-side state, and optimizing component performance.

Key Responsibilities:
- Build highly interactive single-page applications (SPAs) and server-side rendered apps using React and Next.js.
- Implement robust state management using Redux, Context API, or Zustand.
- Optimize components for maximum rendering speed and performance.
- Write unit tests for React components using Jest and React Testing Library.
- Collaborate with frontend architects to design the UI component library.

Requirements:
- Deep expertise in React.js, React Hooks, and component lifecycle.
- Strong JavaScript (ES6+) and TypeScript skills.
- Experience with Next.js and Tailwind CSS is highly preferred.
- Familiarity with web vitals, bundle optimization, and lazy loading.
- Strong knowledge of responsive design and standard web patterns.`
    },
    {
      id: "java-developer",
      title: "Java Developer",
      keywords: ["Java", "Spring Boot", "Spring Cloud", "Hibernate", "JPA", "SQL", "MySQL", "Oracle", "Maven", "Gradle", "RESTful APIs", "Microservices", "Docker", "JUnit", "Git"],
      description: `We are hiring a Java Developer to design, implement, and support enterprise-level Java applications. You will work on high-volume, low-latency applications that require reliability and security.

Key Responsibilities:
- Develop robust, scalable services using Java 11/17 and Spring Boot.
- Write object-relational mapping (ORM) configurations using Hibernate or JPA.
- Design microservices architectures and maintain messaging pipelines (Kafka/RabbitMQ).
- Write unit and integration tests using JUnit and Mockito.
- Optimize application performance and diagnose production issues.

Requirements:
- Strong hands-on experience in core Java and JEE technologies.
- Extensive experience with the Spring Framework (Boot, MVC, Security, Data).
- Solid knowledge of relational databases (MySQL, Oracle, PostgreSQL).
- Experience with Maven or Gradle build tools.
- Understanding of microservices concepts and containerization.`
    },
    {
      id: "python-developer",
      title: "Python Developer",
      keywords: ["Python", "Django", "Flask", "FastAPI", "SQL", "PostgreSQL", "MongoDB", "Pandas", "NumPy", "RESTful APIs", "Docker", "PyTest", "Celery", "Redis", "Git"],
      description: `We are looking for a Python Developer to develop high-quality server-side systems, data pipelines, and REST APIs. You will focus on writing clean, efficient, and well-tested code for various applications.

Key Responsibilities:
- Develop server-side applications using Django, Flask, or FastAPI.
- Implement asynchronous workers and task queues using Celery and Redis.
- Write secure, authenticated APIs and document them.
- Build data processing pipelines or scrape datasets where required.
- Write unit tests with PyTest to maintain codebase reliability.

Requirements:
- Strong proficiency in Python and Pythonic conventions.
- Experience with web frameworks like Django, Flask, or FastAPI.
- Familiarity with ORMs like SQLAlchemy or Django ORM.
- Understanding of data processing libraries (Pandas, NumPy) is a plus.
- Experience with Git and basic command-line navigation.`
    },
    {
      id: "node-js-developer",
      title: "Node.js Developer",
      keywords: ["Node.js", "Express", "NestJS", "JavaScript", "TypeScript", "MongoDB", "Mongoose", "PostgreSQL", "RESTful APIs", "WebSockets", "Socket.io", "Redis", "Docker", "Jest", "Git"],
      description: `We are seeking a Node.js Developer specializing in building high-concurrency server applications and real-time backend systems. You will focus on writing scalable TypeScript/JavaScript server code.

Key Responsibilities:
- Design and develop robust server APIs using Node.js and NestJS or Express.
- Build real-time systems using WebSockets or Socket.io.
- Implement database access layers with Mongoose, Prisma, or TypeORM.
- Optimize API endpoints to handle high throughput and low latencies.
- Secure systems using JWT, OAuth, and standard security practices.

Requirements:
- Strong proficiency in Node.js, JavaScript, and TypeScript.
- Experience with backend frameworks (Express, NestJS, Fastify).
- Familiarity with MongoDB or PostgreSQL databases.
- Experience with server caching (Redis) and message brokers.
- Experience writing asynchronous, non-blocking code.`
    },
    {
      id: "mobile-app-developer",
      title: "Mobile App Developer",
      keywords: ["Swift", "iOS", "Kotlin", "Android", "React Native", "Flutter", "Objective-C", "Java", "Mobile UI", "App Store", "Google Play", "RESTful APIs", "Git", "Redux"],
      description: `We are looking for a Mobile App Developer to build native or cross-platform mobile applications. You will be responsible for creating fluid user interfaces, managing offline storage, and publishing apps.

Key Responsibilities:
- Build robust mobile applications using React Native, Flutter, Swift, or Kotlin.
- Design rich, interactive interfaces conforming to Android/iOS guidelines.
- Integrate REST APIs, handle push notifications, and local storage.
- Optimize app rendering, memory footprint, and startup time.
- Prepare and submit applications to Google Play and Apple App Store.

Requirements:
- Solid experience in React Native, Flutter, Swift (iOS), or Kotlin (Android).
- Strong understanding of mobile application lifecycle and architecture patterns.
- Experience integrating with remote databases and REST APIs.
- Familiarity with offline caching, local encryption, and background sync.
- Experience with Git version control.`
    }
  ],
  "Data & AI": [
    {
      id: "data-analyst",
      title: "Data Analyst",
      keywords: ["SQL", "Python", "R", "Excel", "Tableau", "Power BI", "Pandas", "Matplotlib", "Data Visualization", "Statistics", "Data Cleaning", "Reports", "A/B Testing"],
      description: `We are looking for a Data Analyst to turn data into insights. You will write SQL queries, build dashboards, and perform exploratory analysis to help our leadership make informed business decisions.

Key Responsibilities:
- Write complex, optimized SQL queries to extract data from data warehouses.
- Clean, format, and prepare raw data for visualization and analysis.
- Build, publish, and maintain interactive dashboards in Tableau or Power BI.
- Perform statistical analysis and A/B test evaluations.
- Summarize analysis findings into clear reports for non-technical stakeholders.

Requirements:
- Strong SQL skills (joins, aggregations, window functions, CTEs).
- Proficiency in Python (Pandas, Matplotlib) or R.
- Expertise in BI tools like Tableau, Power BI, or Looker.
- Solid understanding of basic statistics and descriptive analytics.
- Detail-oriented mindset with excellent reporting skills.`
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      keywords: ["Python", "R", "Machine Learning", "Scikit-Learn", "SQL", "Statistics", "Linear Regression", "Decision Trees", "Pandas", "NumPy", "TensorFlow", "NLP", "Data Modeling"],
      description: `We are looking for a Data Scientist to design predictive models and statistical algorithms. You will leverage data science workflows to solve complex predictive problems and enhance product capabilities.

Key Responsibilities:
- Formulate business challenges as machine learning or statistical problems.
- Clean, engineer features, and train predictive models (regression, classification, clustering).
- Build production-ready data science scripts and model inference pipelines.
- Conduct advanced statistical tests to validate model hypothesis.
- Keep up with state-of-the-art algorithms and open-source models.

Requirements:
- Master's or Bachelor's in CS, Math, Statistics, or related field.
- Strong Python scripting skills, including Scikit-Learn, Pandas, and NumPy.
- Experience in statistical modeling, hypothesis testing, and model evaluation.
- Solid understanding of ML algorithms (Random Forests, Gradient Boosting, SVM).
- Familiarity with deep learning frameworks (TensorFlow/PyTorch) is a plus.`
    },
    {
      id: "machine-learning-engineer",
      title: "Machine Learning Engineer",
      keywords: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "MLOps", "MLflow", "Docker", "Kubernetes", "AWS", "SQL", "Model Deployment", "Data Pipelines", "Apache Spark", "Git"],
      description: `We are seeking an ML Engineer to bridge the gap between data science and software engineering. You will build scalable systems to deploy, monitor, and retrain machine learning models in production environments.

Key Responsibilities:
- Package ML models into Docker containers and expose them via REST APIs.
- Build automated retraining, evaluation, and deployment pipelines (MLOps).
- Set up monitoring for model drift, performance latency, and resource metrics.
- Optimize ML model inference using compilation (TensorRT, ONNX).
- Scale data processing pipelines using Spark or Dask.

Requirements:
- Strong software engineering practices in Python (unit testing, clean code).
- Deep experience with PyTorch, TensorFlow, and Scikit-Learn.
- Experience with MLOps tools like MLflow, Kubeflow, or SageMaker.
- Solid knowledge of Docker, Kubernetes, and cloud deployment (AWS/GCP).
- Experience with CI/CD and version control (Git).`
    },
    {
      id: "ai-engineer",
      title: "AI Engineer",
      keywords: ["Python", "OpenAI API", "Hugging Face", "LLMs", "LangChain", "Vector Databases", "Milvus", "Pinecone", "Prompt Engineering", "Fine-tuning", "Semantic Search", "Git", "RAG"],
      description: `We are hiring an AI Engineer to build applications using Generative AI, Large Language Models (LLMs), and retrieval-augmented systems. You will develop AI agents, prompt architectures, and conversational flows.

Key Responsibilities:
- Integrate state-of-the-art LLMs (GPT, Llama, Claude) via APIs and self-hosted instances.
- Build Retrieval-Augmented Generation (RAG) pipelines using LangChain or LlamaIndex.
- Setup vector databases (Pinecone, Chroma, Milvus) and optimize embeddings.
- Design, evaluate, and test prompts to ensure structured, safe AI outputs.
- Fine-tune open-source models for specific tasks or domain domains.

Requirements:
- Strong coding skills in Python.
- Hands-on experience with LLM APIs, LangChain, or Hugging Face Transformers.
- Familiarity with Vector Search, semantic search, and embedding models.
- Understanding of prompt injection, output parsing, and model evaluation metrics.
- Passion for Generative AI advancements and rapid prototyping.`
    }
  ],
  "Cybersecurity": [
    {
      id: "cybersecurity-analyst",
      title: "Cybersecurity Analyst",
      keywords: ["SIEM", "SOC", "Wireshark", "Firewalls", "IDS/IPS", "Incident Response", "Vulnerability Assessment", "CompTIA Security+", "Nmap", "Metasploit", "Active Directory", "Network Security"],
      description: `We are looking for a Cybersecurity Analyst to monitor our network, detect security threats, and respond to security incidents. You will play a key role in our Security Operations Center (SOC).

Key Responsibilities:
- Monitor security logs from SIEM tools and analyze alerts for malicious activity.
- Investigate, contain, and remediate security incidents.
- Conduct vulnerability scans, assess security risks, and recommend remediation steps.
- Configure and audit firewalls, intrusion detection systems (IDS), and access policies.
- Conduct security awareness training and phish testing for employees.

Requirements:
- Professional certifications such as CompTIA Security+, CEH, or GCIH.
- Hands-on experience with SIEM tools (Splunk, Sentinel) and packet analyzers (Wireshark).
- Solid knowledge of networking, firewalls, and Windows/Linux security.
- Familiarity with vulnerability assessment tools (Nessus, Nmap).
- Calm under pressure with strong analytical skills.`
    },
    {
      id: "security-engineer",
      title: "Security Engineer",
      keywords: ["Cryptography", "IAM", "OWASP Top 10", "Penetration Testing", "Security Architecture", "Python", "Cloud Security", "DevSecOps", "SIEM", "SAML/OAuth", "Linux Security", "Git"],
      description: `We are seeking a Security Engineer to design and implement secure systems, build security automation scripts, and integrate security controls directly into our software development lifecycle (DevSecOps).

Key Responsibilities:
- Design secure infrastructure, identity access management (IAM) controls, and encryption solutions.
- Conduct penetration testing and threat modeling for web applications.
- Build custom security automation scripts in Python, Bash, or Go.
- Review code for vulnerabilities (SAST/DAST) and align with OWASP Top 10 guidelines.
- Integrate compliance policies (SOC2, ISO 27001) into our systems.

Requirements:
- Strong background in systems administration (Linux/Windows) and network protocols.
- Experience with web security, OAuth, SAML, TLS, and cryptographic concepts.
- Proficiency in scripting (Python/Bash) to automate security compliance tasks.
- Experience with cloud infrastructure security (AWS/Azure).
- Strong understanding of secure coding principles.`
    }
  ],
  "Cloud & DevOps": [
    {
      id: "devops-engineer",
      title: "DevOps Engineer",
      keywords: ["CI/CD", "Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Terraform", "Ansible", "AWS", "Azure", "Linux", "Bash", "YAML", "Git", "Python", "Monitoring"],
      description: `We are seeking a DevOps Engineer to automate and streamline our operations and development processes. You will design, build, and maintain our CI/CD pipelines, configuration management, and developer tools.

Key Responsibilities:
- Build and optimize CI/CD pipelines using GitHub Actions, GitLab CI, or Jenkins.
- Write Infrastructure as Code (IaC) templates in Terraform or CloudFormation.
- Maintain container orchestration templates (Kubernetes) and Helm charts.
- Automate configuration management using Ansible or Chef.
- Administer Linux environments, build systems, and containerized runtimes.

Requirements:
- Experience as a DevOps Engineer, System Administrator, or Site Reliability Engineer.
- Deep expertise in Docker, Kubernetes, and container security.
- Strong proficiency in Terraform and writing clean YAML pipelines.
- Solid Bash/Shell scripting skills, and some Python knowledge.
- Good knowledge of cloud providers, primarily AWS or Azure.`
    },
    {
      id: "cloud-engineer",
      title: "Cloud Engineer",
      keywords: ["AWS", "Azure", "GCP", "IAM", "Cloud Architecture", "Terraform", "VPC", "EC2", "S3", "Kubernetes", "Docker", "Linux", "Python", "Git", "Serverless"],
      description: `We are looking for a Cloud Engineer to architect, build, and migrate enterprise workloads to cloud environments. You will optimize cloud costs, establish cloud guardrails, and manage networking topologies.

Key Responsibilities:
- Architect secure, multi-account environments using cloud best practices.
- Provision cloud resources (databases, virtual networks, compute) using Terraform.
- Configure cloud security groups, IAM roles, active directory integrations, and KMS keys.
- Monitor cloud usage, optimize asset allocation, and implement cost-saving policies.
- Build serverless integrations using AWS Lambda, Azure Functions, or Cloud Run.

Requirements:
- Solid experience working with AWS, Azure, or GCP (Certifications are a major plus).
- Proficient in Infrastructure as Code (IaC), preferably Terraform.
- Strong networking knowledge (VPC peering, NAT gateways, DNS, load balancers).
- Familiarity with cloud security compliance (CIS benchmarks, IAM roles).
- Basic automation skills using Python or Bash.`
    },
    {
      id: "site-reliability-engineer",
      title: "Site Reliability Engineer",
      keywords: ["Kubernetes", "SLA/SLO/SLI", "Prometheus", "Grafana", "ELK Stack", "Docker", "Terraform", "Incident Management", "Python", "Linux", "Networking", "Chaos Engineering"],
      description: `We are seeking a Site Reliability Engineer (SRE) to ensure our production systems are highly available, resilient, and performant. You will balance product feature delivery velocity with operational stability.

Key Responsibilities:
- Define Service Level Indicators (SLIs), SLOs, and error budgets for core services.
- Build and maintain monitoring dashboards in Grafana and alerting setups in Prometheus.
- Participate in on-call rotations, run post-mortems, and eliminate system toil through automation.
- Design disaster recovery procedures, failovers, and backup validations.
- Conduct chaos engineering experiments to identify single points of failure.

Requirements:
- Solid background in systems engineering and network architecture.
- Proficient in programming (Python, Go, Java) and shell scripting.
- Experience operating complex Kubernetes environments in production.
- Deep expertise with observability platforms (Prometheus, Datadog, ELK).
- Strong communication skills and a passion for engineering highly available systems.`
    }
  ],
  "Business & Management": [
    {
      id: "business-analyst",
      title: "Business Analyst",
      keywords: ["SQL", "Agile", "Scrum", "User Stories", "Requirements Gathering", "UML", "Jira", "Confluence", "Data Analysis", "Visio", "Excel", "Business Process Modeling"],
      description: `We are looking for a Business Analyst to act as the bridge between our business stakeholders and development team. You will gather requirements, write documentation, and support product releases.

Key Responsibilities:
- Interview stakeholders to define business problems and document user requirements.
- Translate business requirements into detailed user stories and functional specs.
- Create process flows, wireframes, and UML diagrams.
- Help prioritize the product backlog in Jira using Agile methodologies.
- Participate in sprint planning, retrospectives, and user acceptance testing (UAT).

Requirements:
- Experience in business analysis, requirements elicitation, and project documentation.
- Excellent communication and presentation skills (verbal and written).
- Proficiency in Jira, Confluence, and process flow tools like Visio or Lucidchart.
- Basic data querying skills using SQL.
- Familiarity with Agile/Scrum software development lifecycles.`
    },
    {
      id: "product-manager",
      title: "Product Manager",
      keywords: ["Product Strategy", "Roadmapping", "Agile", "User Research", "Jira", "Confluence", "Product Specs", "A/B Testing", "Data Analytics", "Customer Interviews", "Market Analysis", "Figma"],
      description: `We are seeking a Product Manager to define the product vision, strategy, and roadmap. You will work closely with engineering, design, and marketing to build and launch successful product features.

Key Responsibilities:
- Define the product roadmap, prioritize features, and write comprehensive specs.
- Perform user research, customer interviews, and market analysis.
- Define and track key performance indicators (KPIs) to measure feature success.
- Coordinate product launches across engineering, support, marketing, and sales.
- Collaborate with designers to run prototype testing and iterate designs.

Requirements:
- Proven experience as a Product Manager launching web or mobile software products.
- Strong analytical skills, with experience using GA, Mixpanel, or SQL.
- Excellent communication skills and ability to influence cross-functional teams.
- Solid understanding of Agile/Scrum frameworks.
- Design-oriented mindset with basic wireframing or Figma skills.`
    },
    {
      id: "project-manager",
      title: "Project Manager",
      keywords: ["Project Planning", "Agile", "Scrum", "Waterfall", "Risk Management", "Jira", "Confluence", "MS Project", "Budgets", "Stakeholder Management", "PMP", "Scrum Master"],
      description: `We are looking for a Project Manager to deliver projects on time, within scope, and within budget. You will run sprint schedules, coordinate resource allocation, and manage stakeholder communications.

Key Responsibilities:
- Define project scopes, create work breakdown structures (WBS), and track milestones.
- Facilitate daily standups, sprint planning, and retrospective sessions as a Scrum Master.
- Manage project budgets, resource constraints, and risk mitigation strategies.
- Report project progress, velocities, and resource bottlenecks to executive leadership.
- Coordinate integrations with external vendors and client delivery teams.

Requirements:
- Proven experience managing software development projects.
- Certified Scrum Master (CSM) or Project Management Professional (PMP) is a plus.
- Advanced expertise in Jira, Confluence, and MS Project.
- Exceptional organizational, scheduling, and delegation skills.
- Excellent stakeholder management and negotiation skills.`
    }
  ],
  "Finance": [
    {
      id: "financial-analyst",
      title: "Financial Analyst",
      keywords: ["Excel", "Financial Modeling", "Valuation", "Forecasting", "Data Analysis", "Python", "SQL", "Bloomberg Terminal", "Corporate Finance", "GAAP", "KPIs", "Accounting"],
      description: `We are seeking a Financial Analyst to perform budgeting, forecasting, and financial modeling. You will analyze corporate performance metrics and support strategic planning.

Key Responsibilities:
- Build, update, and audit complex financial models in Excel.
- Perform monthly variances, budgeting, and rolling financial forecasts.
- Analyze company operational KPIs and present reports to senior leadership.
- Prepare valuation models and cost-benefit analysis for new initiatives.
- Support treasury activities and audit compliance.

Requirements:
- Strong knowledge of corporate finance, GAAP accounting principles, and valuation.
- Advanced Excel skills (macros, index/match, financial modeling formulas).
- Familiarity with SQL, Power BI, or Python for data analysis is a plus.
- Analytical mindset with high attention to detail.
- Excellent communication skills to explain financial data to non-finance leads.`
    },
    {
      id: "accountant",
      title: "Accountant",
      keywords: ["GAAP", "QuickBooks", "SAP", "Tax Compliance", "Payroll", "Reconciliation", "General Ledger", "Excel", "Auditing", "Financial Statements", "Journal Entries"],
      description: `We are looking for an Accountant to manage daily accounting entries, bank reconciliations, tax compliance, and payroll. You will ensure financial records are complete and accurate.

Key Responsibilities:
- Prepare journal entries and manage the general ledger.
- Perform monthly bank reconciliations, accounts payable (AP), and accounts receivable (AR).
- Prepare quarterly financial statements (balance sheet, income statement).
- Coordinate tax filings, payroll processing, and audit preparation.
- Ensure compliance with local laws and GAAP standards.

Requirements:
- Bachelor's in Accounting, Finance, or equivalent. CPA is a plus.
- Experience with QuickBooks, SAP, or Sage accounting systems.
- Strong Excel skills (pivot tables, vlookup) and data accuracy.
- Good knowledge of tax regulations, payroll processing, and auditing.
- Highly organized and ethical professional.`
    }
  ],
  "Marketing": [
    {
      id: "digital-marketing-executive",
      title: "Digital Marketing Executive",
      keywords: ["Google Ads", "Facebook Ads", "SEO", "Google Analytics", "Content Strategy", "Email Marketing", "Copywriting", "SMM", "Mailchimp", "Canva", "PPC", "ROI"],
      description: `We are seeking a Digital Marketing Executive to plan and execute pay-per-click (PPC) ads, manage social media channels, and implement customer acquisition campaigns.

Key Responsibilities:
- Set up, monitor, and optimize ad campaigns on Google Ads and Meta Ads.
- Run company social media accounts (Instagram, LinkedIn, X) to grow organic reach.
- Design and execute email newsletters and drip campaigns.
- Write ad copy, blog posts, and landing page content.
- Monitor traffic acquisition channels and ROI using Google Analytics.

Requirements:
- Experience managing paid marketing campaigns (Meta/Google).
- Good understanding of SEO, social media marketing, and email tools (Mailchimp/Klaviyo).
- Excellent copywriting skills and aesthetic sense (Familiarity with Canva).
- Analytical approach, with ability to read traffic and ROI data.
- Creative and proactive mindset.`
    },
    {
      id: "seo-specialist",
      title: "SEO Specialist",
      keywords: ["SEO", "Google Search Console", "SEMrush", "Ahrefs", "Keyword Research", "On-Page SEO", "Off-Page SEO", "Link Building", "Sitemaps", "Technical SEO", "Google Analytics"],
      description: `We are looking for an SEO Specialist to improve our search engine rankings and increase organic search traffic. You will audit sitemaps, write optimization recommendations, and build backlinks.

Key Responsibilities:
- Perform exhaustive keyword research to uncover content opportunities.
- Optimize website metadata, heading tags, schema, and page speeds.
- Perform technical SEO audits and coordinate fixes with development teams.
- Run link-building outreach campaigns to build site authority.
- Monitor indexation status and traffic metrics using Google Search Console and SEMrush.

Requirements:
- Proven experience driving organic search growth for commercial websites.
- Expert-level knowledge of Google Search Console, Ahrefs, SEMrush, or Screaming Frog.
- Deep understanding of Google algorithms, indexing, and rendering.
- Basic understanding of HTML/JS is a major advantage.
- Strong analytical and spreadsheets skills.`
    },
    {
      id: "content-writer",
      title: "Content Writer",
      keywords: ["Copywriting", "Blog Writing", "SEO writing", "Social Media", "Editing", "Proofreading", "Creative Writing", "Research", "Content Strategy", "WordPress"],
      description: `We are hiring a Content Writer to produce engaging articles, guides, copy, and scripts that resonate with our target audience and support brand growth.

Key Responsibilities:
- Write well-researched, engaging blog posts, guides, and ebooks.
- Craft persuasive copywriting for landing pages, ads, and product descriptions.
- Optimize copy for SEO keywords and user readability.
- Proofread, edit, and refresh existing content assets.
- Coordinate publishing schedules on WordPress or other CMS tools.

Requirements:
- Outstanding written English communication skills and vocabulary.
- Experience writing for web audiences and basic knowledge of SEO copywriting.
- Ability to research complex subjects and explain them simply.
- Highly organized with strong proofreading and editing skills.
- Creative portfolio demonstrating articles or copy.`
    }
  ],
  "Human Resources": [
    {
      id: "hr-executive",
      title: "HR Executive",
      keywords: ["Onboarding", "Employee Relations", "Payroll Management", "Performance Management", "Recruitment", "HRIS", "Labor Laws", "Compliance", "Employee Engagement", "Training"],
      description: `We are looking for an HR Executive to support our human resource workflows, manage employee onboarding/offboarding, coordinate performance reviews, and run engagement activities.

Key Responsibilities:
- Coordinate employee onboarding, exit interviews, and documentation.
- Maintain employee records, contracts, and profiles in the HRIS tool.
- Assist in processing payroll, managing employee leaves, and benefits.
- Coordinate annual performance review cycles and training requests.
- Organize company-wide team building and employee engagement events.

Requirements:
- Good knowledge of HR best practices, labor laws, and compliance procedures.
- Excellent interpersonal, conflict-resolution, and presentation skills.
- Experience working with HRIS tools (BambooHR, Keka, Zoho People).
- High levels of confidentiality, empathy, and professional integrity.
- Highly organized with strong administrative skills.`
    },
    {
      id: "recruiter",
      title: "Recruiter",
      keywords: ["ATS", "Sourcing", "LinkedIn Recruiter", "Interviews", "Cold Outreach", "Resume Screening", "Job Postings", "Negotiation", "Candidate Experience", "Hiring Manager Integration"],
      description: `We are hiring a Recruiter to find, engage, screen, and close top talent for our growing teams. You will drive candidate pipeline sourcing, schedule interviews, and negotiate offers.

Key Responsibilities:
- Collaborate with hiring managers to define candidate personas and write job specs.
- Source passive candidates using LinkedIn Recruiter, GitHub, and job boards.
- Screen incoming resumes and conduct initial phone validation interviews.
- Schedule subsequent rounds, manage candidate expectations, and maintain the ATS.
- Prepare offer proposals and run salary negotiation and closing conversations.

Requirements:
- Solid experience sourcing candidates for tech or non-tech teams.
- Advanced proficiency with LinkedIn Recruiter and Applicant Tracking Systems (e.g. Lever, Greenhouse).
- Outstanding communications, relationship-building, and negotiation skills.
- Ability to screen candidates for core technical and cultural fits.
- Proactive candidate-centric approach.`
    }
  ],
  "Design": [
    {
      id: "ui-ux-designer",
      title: "UI/UX Designer",
      keywords: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "User Journeys", "Design Systems", "UI Design", "UX Design", "Mockups", "Interaction Design", "Usability Testing"],
      description: `We are seeking a UI/UX Designer to design user flows, high-fidelity mockups, and interactive prototypes. You will run user research and maintain our corporate design system.

Key Responsibilities:
- Conduct user research, define user personas, and map user journeys.
- Create wireframes, interactive user flows, and site architecture maps.
- Design pixel-perfect web/mobile interfaces in Figma.
- Build and maintain our visual design component library and style guides.
- Conduct usability testing and iterate designs based on feedback.

Requirements:
- Proven UI/UX portfolio demonstrating user-centric design approaches.
- Advanced expertise in Figma or Sketch/Adobe XD.
- Strong understanding of color theory, typography, spacing, and grids.
- Familiarity with interactive micro-animations and responsive layouts.
- Excellent collaboration skills to integrate designs with engineering.`
    },
    {
      id: "graphic-designer",
      title: "Graphic Designer",
      keywords: ["Photoshop", "Illustrator", "InDesign", "Branding", "Typography", "Vector Illustration", "Layout Design", "Canva", "Print Design", "Digital Banners", "Logo Design"],
      description: `We are looking for a Graphic Designer to create stunning digital and print visual assets, design brand campaigns, and maintain visual branding across marketing assets.

Key Responsibilities:
- Create vector icons, illustrations, and digital graphics.
- Design print brochures, packaging, and tradeshow layouts.
- Design digital ad banners, social media assets, and presentation decks.
- Maintain visual assets library and ensure brand guideline consistency.
- Collaborate with copywriters and digital marketers to launch visual campaigns.

Requirements:
- Strong portfolio showing print and digital design capabilities.
- Expert-level skills in Adobe Creative Suite (Photoshop, Illustrator, InDesign).
- Strong command of typography, composition, and visual aesthetics.
- High attention to detail, organization, and deadline adherence.
- Creative mindset with the ability to conceptualize original layouts.`
    }
  ],
  "Freshers": [
    {
      id: "software-engineer-fresher",
      title: "Software Engineer Fresher",
      keywords: ["Algorithms", "Data Structures", "OOPs", "C++", "Java", "Python", "SQL", "Git", "Problem Solving", "Problem-solving", "HTML", "CSS", "JavaScript"],
      description: `We are looking for enthusiastic Freshers to join our engineering division. You will receive extensive training and work alongside senior engineers to develop and debug our software systems.

Key Responsibilities:
- Learn our tech stack and adopt standard software engineering practices.
- Write clean, validated code to implement basic software features.
- Troubleshoot, debug, and fix software defects reported in Jira.
- Write documentation for services, code modules, and API calls.
- Participate actively in code reviews and engineering seminars.

Requirements:
- Bachelor's in Computer Science, Engineering, or related technical field.
- Strong understanding of basic programming principles, OOPs concepts, and SQL.
- Strong knowledge of Data Structures and Algorithms (DSA).
- Basic experience with version control (Git).
- Quick learner with excellent analytical and reasoning abilities.`
    },
    {
      id: "graduate-trainee",
      title: "Graduate Trainee",
      keywords: ["Communication", "Excel", "PowerPoint", "Analytical Skills", "Problem Solving", "Documentation", "Project Coordination", "Market Research", "Reporting"],
      description: `We are looking for Graduate Trainees to rotate across multiple departments (Operations, Sales, Analyst teams) to learn our business models, support departments, and coordinate projects.

Key Responsibilities:
- Rotate through corporate divisions, mastering operations, metrics, and workflows.
- Research market trends, compile operational data, and present slide reports.
- Support teams in scheduling meetings, documenting minutes, and formatting specs.
- Draft correspondence, coordinate timelines, and organize databases.
- Participate in structured leadership training and feedback sessions.

Requirements:
- Bachelor's degree in any discipline with high academic achievements.
- Exceptional written and verbal communication and reporting skills.
- Proficient in MS Office Suite (Excel, Word, PowerPoint).
- Strong analytical approach to problem-solving.
- Eager to learn, collaborate, and adapt to changing environments.`
    },
    {
      id: "internship-roles",
      title: "Internship Roles",
      keywords: ["HTML", "CSS", "JavaScript", "Python", "Java", "SQL", "React", "Excel", "Sourcing", "Figma", "Research", "Team player"],
      description: `We offer dynamic Internship Roles across Engineering, Marketing, Product Design, and Human Resources. This 3-6 month program offers real project work, mentoring, and potential full-time offers.

Key Responsibilities:
- Work alongside professional mentors on actual commercial projects.
- Support research, prepare data analysis sheets, and draft code or designs.
- Participate in team sprint planning, check-ins, and feedback sessions.
- Deliver a final internship project presentation to the executive team.
- Support administrative coordination tasks as assigned.

Requirements:
- Currently enrolled in or recently graduated from a relevant degree course.
- Basic familiarity with domain tools (e.g. coding editors, Figma, sheets, or Google Analytics).
- Excellent team player with a high willingness to learn and ask questions.
- Strong communication and follow-through.
- High attention to detail.`
    }
  ]
};

// Returns a flat list of all roles in the library
export function getAllRoles() {
  const roles = [];
  for (const domain in roleLibrary) {
    roleLibrary[domain].forEach(role => {
      roles.push({
        ...role,
        domain
      });
    });
  }
  return roles;
}

// Smart recommendation engine that scores a resume text against all library roles
// returns the top 3-5 roles with confidence percentages based on advanced criteria.
export function recommendRoles(resumeText) {
  if (!resumeText) return [];
  
  const text = resumeText.toLowerCase();
  const allRoles = getAllRoles();
  const scores = allRoles.map(role => {
    // 1. Calculate Keyword match density
    let matchesCount = 0;
    role.keywords.forEach(keyword => {
      // Use word-boundary regex to prevent partial word matches (e.g., 'java' matching 'javascript')
      let escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      let regex = new RegExp('\\b' + escaped + '\\b', 'gi');
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        matchesCount += Math.min(3, matches.length); // Weight multiple occurrences up to 3 times
      }
    });

    const maxPossibleMatches = role.keywords.length * 1.5;
    let baseScore = maxPossibleMatches > 0 ? (matchesCount / maxPossibleMatches) * 100 : 0;
    
    // 2. Extra domain weighting rules
    // Software Development check
    if (role.domain === "Software Development") {
      if (text.includes("developer") || text.includes("engineer") || text.includes("code") || text.includes("programming")) {
        baseScore += 12;
      }
    }
    // Data & AI check
    if (role.domain === "Data & AI") {
      if (text.includes("data") || text.includes("model") || text.includes("analysis") || text.includes("statistics") || text.includes("machine learning")) {
        baseScore += 12;
      }
    }
    // Design check
    if (role.domain === "Design") {
      if (text.includes("design") || text.includes("figma") || text.includes("ux") || text.includes("ui") || text.includes("portfolio")) {
        baseScore += 12;
      }
    }
    // Finance check
    if (role.domain === "Finance") {
      if (text.includes("financial") || text.includes("accounting") || text.includes("ledger") || text.includes("excel") || text.includes("tax")) {
        baseScore += 12;
      }
    }
    // Marketing check
    if (role.domain === "Marketing") {
      if (text.includes("marketing") || text.includes("seo") || text.includes("ads") || text.includes("content") || text.includes("social")) {
        baseScore += 12;
      }
    }
    // Cybersecurity check
    if (role.domain === "Cybersecurity") {
      if (text.includes("security") || text.includes("threat") || text.includes("siem") || text.includes("firewall") || text.includes("vulnerability")) {
        baseScore += 12;
      }
    }

    // 3. Scale confidence percentage between 40% and 98%
    let confidence = Math.round(40 + (baseScore / 130) * 58);
    confidence = Math.max(40, Math.min(98, confidence));
    
    return {
      id: role.id,
      title: role.title,
      domain: role.domain,
      confidence,
      description: role.description
    };
  });

  // Sort by confidence descending
  scores.sort((a, b) => b.confidence - a.confidence);

  // Return the top 4 recommended roles
  return scores.slice(0, 4);
}
