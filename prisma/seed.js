import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding of Indian opportunities...");

  // 1. Clean existing records in public tables to prevent seed duplicates (does NOT touch analysis_logs)
  await prisma.bookmark.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.internship.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.company.deleteMany({});

  // 2. Create Companies
  const companies = [
    {
      name: "Google India",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      website: "https://careers.google.com",
      description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
      industry: "Technology",
      headquarters: "Bangalore, India",
      isTrending: true
    },
    {
      name: "CRED",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Cred_logo.svg",
      website: "https://cred.club",
      description: "CRED is a members-only club that rewards individuals for their timely credit card bill payments.",
      industry: "Fintech",
      headquarters: "Bangalore, India",
      isTrending: true
    },
    {
      name: "TCS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
      website: "https://tcs.com",
      description: "Tata Consultancy Services is an IT services, consulting and business solutions organization.",
      industry: "IT Services",
      headquarters: "Mumbai, India",
      isTrending: false
    },
    {
      name: "Swiggy",
      logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
      website: "https://swiggy.com",
      description: "Swiggy is India's leading on-demand delivery platform, connecting consumers to restaurants, groceries, and more.",
      industry: "Consumer Tech",
      headquarters: "Bangalore, India",
      isTrending: true
    },
    {
      name: "Razorpay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      website: "https://razorpay.com",
      description: "Razorpay is a leading payments solution in India that allows businesses to accept, process and disburse payments.",
      industry: "Fintech",
      headquarters: "Bangalore, India",
      isTrending: true
    },
    {
      name: "PhonePe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/77/PhonePe_Logo.svg",
      website: "https://phonepe.com",
      description: "PhonePe is a mobile payments platform that allows users to transfer money instantly.",
      industry: "Fintech",
      headquarters: "Bangalore, India",
      isTrending: true
    }
  ];

  const dbCompanies = {};
  for (const c of companies) {
    const created = await prisma.company.create({ data: c });
    dbCompanies[c.name] = created;
  }

  // 3. Create Jobs
  const jobs = [
    {
      title: "Software Engineer - Front End (Fresher)",
      companyId: dbCompanies["CRED"].id,
      location: "Bangalore, India",
      salary: "12-15 LPA",
      experience: "0-1 years",
      skills: ["React.js", "JavaScript", "HTML5", "CSS3", "Redux"],
      description: "We are looking for a passionate Front End Engineer to join our core member experience team. You will build high-quality, pixel-perfect user interfaces, collaborate with product designers, and optimize web applications for speed and scalability.",
      responsibilities: "Write clean, testable, and reusable front-end code. Collaborate with designers and backend engineers. Diagnose and fix rendering performance bottlenecks.",
      requirements: "Strong understanding of ES6+, React, and modern CSS practices. Experience with state management tools. Portfolio of responsive web projects.",
      applyUrl: "https://careers.cred.club",
      type: "Full-time",
      department: "Software",
      isApproved: true,
      isFeatured: true,
      aiSummary: "An entry-level Front End role at CRED in Bangalore. Work on core web products using React and JavaScript to deliver high-quality web interfaces for millions of users.",
      aiSkills: ["React", "JavaScript", "HTML", "CSS"],
      aiSalary: "12-15 LPA",
      aiExperience: "0-1 years",
      aiTechnologies: ["React.js", "Redux", "Webpack"],
      aiLocation: "Bangalore",
      aiAtsKeywords: ["Front End Engineer", "React.js Developer", "JavaScript UI Developer", "CSS3 Grid", "Redux Toolkit"]
    },
    {
      title: "Software Engineer - Backend (Node.js)",
      companyId: dbCompanies["Swiggy"].id,
      location: "Bangalore, India",
      salary: "14-18 LPA",
      experience: "0-2 years",
      skills: ["Node.js", "Express.js", "PostgreSQL", "Redis", "REST APIs"],
      description: "Join the delivery tracking backend team. You will build scalable microservices that handle real-time geolocation updates, process delivery partner payouts, and optimize dispatch routes.",
      responsibilities: "Design, build, and maintain highly scalable backend services. Optimize database queries and schema designs. Write API specifications and unit tests.",
      requirements: "Solid foundations in Node.js, asynchronous programming, and SQL databases. Basic knowledge of caching layers (Redis). Familiarity with Docker is a plus.",
      applyUrl: "https://careers.swiggy.com",
      type: "Full-time",
      department: "Software",
      isApproved: true,
      isFeatured: true,
      aiSummary: "Backend Engineering position at Swiggy, Bangalore. Develop food and grocery delivery logistics pipelines using Node.js, Express, and PostgreSQL microservices.",
      aiSkills: ["Node.js", "Express", "SQL", "Redis"],
      aiSalary: "14-18 LPA",
      aiExperience: "0-2 years",
      aiTechnologies: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      aiLocation: "Bangalore",
      aiAtsKeywords: ["Backend Engineer", "Node.js Architect", "REST API Development", "Redis Caching", "PostgreSQL Optimization"]
    },
    {
      title: "Systems Engineer (Fresher Hiring)",
      companyId: dbCompanies["TCS"].id,
      location: "Pune, India",
      salary: "4-5 LPA",
      experience: "0-0 years",
      skills: ["Java", "SQL", "Python", "Data Structures", "OOPs"],
      description: "Tata Consultancy Services (TCS) invites applications for Systems Engineers. This entry-level role provides training and placement in global consulting and software delivery assignments.",
      responsibilities: "Participate in training academy modules. Assist in software maintenance, application support, and database querying. Write and execute test scripts.",
      requirements: "B.E / B.Tech / MCA / M.Sc graduates from 2025/2026 batches. Strong conceptual understanding of OOPs, programming languages, and basic databases.",
      applyUrl: "https://www.tcs.com/careers",
      type: "Full-time",
      department: "IT Services",
      isApproved: true,
      isFeatured: false,
      aiSummary: "TCS Systems Engineer role in Pune. Open strictly to fresh graduates. Includes comprehensive corporate training and placement into enterprise application engineering projects.",
      aiSkills: ["Java", "SQL", "OOPs"],
      aiSalary: "4-5 LPA",
      aiExperience: "0-0 years",
      aiTechnologies: ["Java SE", "SQL Server", "Python"],
      aiLocation: "Pune",
      aiAtsKeywords: ["Systems Engineer", "TCS National Qualifier Test", "Entry Level Software", "SQL Queries", "Java Programming"]
    },
    {
      title: "Associate Product Manager",
      companyId: dbCompanies["Razorpay"].id,
      location: "Bangalore, India",
      salary: "15-20 LPA",
      experience: "0-2 years",
      skills: ["Product Strategy", "Data Analytics", "SQL", "UX Principles", "Agile"],
      description: "We are seeking a curious Associate Product Manager to own product features from design to launch. You will write PRDs, look at SQL query dashboards, and design payment checkout flows.",
      responsibilities: "Define product requirements and specifications. Analyze product metrics using SQL and Amplitude. Collaborate with design and engineering teams.",
      requirements: "Technical background (CS/Engineering degree) or equivalent experience. Outstanding written and verbal communication. Analytical mindset.",
      applyUrl: "https://razorpay.com/jobs",
      type: "Full-time",
      department: "Product",
      isApproved: true,
      isFeatured: true,
      aiSummary: "APM role at Razorpay, Bangalore. Manage payment integration tools, analyze checkout metrics, and work closely with developers to deliver seamless transaction experiences.",
      aiSkills: ["Product Management", "Data Analytics", "UX Design"],
      aiSalary: "15-20 LPA",
      aiExperience: "0-2 years",
      aiTechnologies: ["SQL", "Amplitude", "Jira"],
      aiLocation: "Bangalore",
      aiAtsKeywords: ["Associate Product Manager", "Product Requirements Document", "Wireframing", "SQL Queries", "User Experience Optimization"]
    }
  ];

  for (const j of jobs) {
    await prisma.job.create({ data: j });
  }

  // 4. Create Internships
  const internships = [
    {
      title: "Software Engineering Intern",
      companyId: dbCompanies["Google India"].id,
      location: "Bangalore, India",
      stipend: "₹80,000 / month",
      duration: "6 months",
      skills: ["Java", "C++", "Python", "Data Structures", "Algorithms"],
      description: "Google's software interns work on real engineering tasks and technologies. You will code, design, and participate in code reviews alongside Google engineers.",
      responsibilities: "Write high-performance code. Participate in architecture and system design reviews. Debug and document software modules.",
      requirements: "Enrolled in a Bachelor's, Master's, or PhD in Computer Science or related fields, returning to university after the internship.",
      applyUrl: "https://careers.google.com",
      type: "Paid",
      mode: "On-site",
      isApproved: true,
      isFeatured: true,
      aiSummary: "Highly competitive 6-month Software Intern role at Google India, Bangalore. Build core infrastructure products and learn production engineering standards."
    },
    {
      title: "Frontend Development Intern",
      companyId: dbCompanies["PhonePe"].id,
      location: "Remote - India",
      stipend: "₹35,000 / month",
      duration: "3 months",
      skills: ["React.js", "TypeScript", "Tailwind CSS", "JavaScript"],
      description: "Join the merchant dashboard engineering team. You will work on frontend widgets, optimize analytics charts, and clean up style files.",
      responsibilities: "Build web widgets in React. Ensure mobile responsiveness. Hook up dashboards to REST API endpoints.",
      requirements: "Prior projects in React and Tailwind. Available for full-time remote internship for 3 months.",
      applyUrl: "https://phonepe.com/careers",
      type: "Paid",
      mode: "Remote",
      isApproved: true,
      isFeatured: true,
      aiSummary: "Remote Frontend Internship at PhonePe. Focus on building and styling merchant dashboard panels using React.js and Tailwind CSS."
    }
  ];

  for (const i of internships) {
    await prisma.internship.create({ data: i });
  }

  // 5. Create Hackathons
  const hackathons = [
    {
      name: "HackIndia 2026",
      organizer: "Devfolio",
      prizePool: "₹10,00,000",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      mode: "Hybrid",
      difficulty: "All Levels",
      teamSize: "2-4 members",
      url: "https://devfolio.co",
      description: "India's premier web3 and software hackathon. Build next-generation decentralized apps or core AI software systems over a 48-hour sprint in Noida/Online.",
      isApproved: true
    },
    {
      name: "Smart India Hackathon 2026",
      organizer: "Ministry of Education, Govt. of India",
      prizePool: "₹25,00,000",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      mode: "Offline",
      difficulty: "Intermediate",
      teamSize: "6 members",
      url: "https://sih.gov.in",
      description: "SIH is a nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.",
      isApproved: true
    }
  ];

  for (const h of hackathons) {
    await prisma.hackathon.create({ data: h });
  }

  console.log("Seeding complete! Successfully added: ");
  console.log(`- ${companies.length} Companies`);
  console.log(`- ${jobs.length} Jobs`);
  console.log(`- ${internships.length} Internships`);
  console.log(`- ${hackathons.length} Hackathons`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
