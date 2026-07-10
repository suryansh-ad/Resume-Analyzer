import { prisma } from "../../../../lib/prisma.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth.js";

export const runtime = "nodejs";

function calculateMatchScore(opportunity, profile) {
  let score = 0;
  const userSkills = (profile.skills || []).map(s => s.trim().toLowerCase());
  const userInterests = (profile.interests || []).map(i => i.trim().toLowerCase());
  
  const title = (opportunity.title || "").toLowerCase();
  const description = (opportunity.description || "").toLowerCase();
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase());
  const oppAiSkills = (opportunity.aiSkills || []).map(s => s.toLowerCase());
  
  // 1. Skill Match Overlaps
  let matchedSkillsCount = 0;
  userSkills.forEach(skill => {
    if (oppSkills.includes(skill) || oppAiSkills.includes(skill)) {
      score += 10; // direct match in required skills
      matchedSkillsCount++;
    } else if (title.includes(skill)) {
      score += 6; // matching skill in title
    } else if (description.includes(skill)) {
      score += 2; // matching skill in description
    }
  });

  // 2. Interest/Role Alignment
  userInterests.forEach(interest => {
    if (title.includes(interest)) {
      score += 8; // direct match of interest in title
    } else if (description.includes(interest)) {
      score += 2; // interest in description
    }
  });

  // 3. Location/City Preference Match
  if (profile.cityPreference) {
    const cityPref = profile.cityPreference.toLowerCase();
    const oppLocation = (opportunity.location || "").toLowerCase();
    
    if (oppLocation.includes(cityPref)) {
      score += 15; // strong match for city preference!
    } else if (cityPref === "remote" && (oppLocation.includes("remote") || oppLocation.includes("work from home"))) {
      score += 15; // remote match
    } else if (cityPref !== "remote" && oppLocation.includes("remote")) {
      score += 5; // remote is acceptable fallback
    } else {
      score -= 5; // physical location mismatch
    }
  }

  // 4. Experience Years Match
  const expRequirementStr = (opportunity.experience || opportunity.aiExperience || "").toLowerCase();
  const userExp = profile.experienceYears || 0;
  
  if (expRequirementStr) {
    const numbers = expRequirementStr.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const minExpRequired = parseInt(numbers[0]);
      if (userExp >= minExpRequired) {
        score += 10;
      } else {
        score -= 15;
      }
    } else {
      if (expRequirementStr.includes("fresher") || expRequirementStr.includes("entry") || expRequirementStr.includes("junior")) {
        if (userExp <= 2) score += 10;
      } else if (expRequirementStr.includes("mid") || expRequirementStr.includes("senior")) {
        if (userExp >= 3) score += 10;
        else score -= 15;
      }
    }
  } else {
    score += 5;
  }

  // Calculate percentage
  let maxPossibleScore = Math.max(10, userSkills.length * 10 + userInterests.length * 8);
  if (profile.cityPreference) maxPossibleScore += 15;
  maxPossibleScore += 10; // exp weight
  
  const matchPercentage = Math.max(0, Math.min(100, Math.round((score / maxPossibleScore) * 100)));

  return { score, matchPercentage };
}

export async function GET(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || ((profile.skills || []).length === 0 && (profile.interests || []).length === 0)) {
      return Response.json({ jobs: [], internships: [] });
    }

    // Fetch all approved jobs and internships
    const [jobs, internships] = await Promise.all([
      prisma.job.findMany({
        where: { isApproved: true },
        include: { company: true },
      }),
      prisma.internship.findMany({
        where: { isApproved: true },
        include: { company: true },
      })
    ]);

    // Calculate match scores and filter/sort jobs
    const matchedJobs = jobs
      .map(job => {
        const { score, matchPercentage } = calculateMatchScore(job, profile);
        return { ...job, matchScore: score, matchPercentage };
      })
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    // Calculate match scores and filter/sort internships
    const matchedInternships = internships
      .map(internship => {
        const { score, matchPercentage } = calculateMatchScore(internship, profile);
        return { ...internship, matchScore: score, matchPercentage };
      })
      .filter(internship => internship.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return Response.json({ jobs: matchedJobs, internships: matchedInternships });
  } catch (error) {
    console.error("[GET /api/profile/matches] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
