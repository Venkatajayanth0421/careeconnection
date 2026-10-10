import { mockStore } from './src/api/mockStore.js';

async function run() {
  console.log('--- Testing AI Recommendations for Student 1 (Rahul Sharma) ---');
  const res = await mockStore.getRecommendationsForStudent(1);
  console.log('Success:', res.success);
  console.log('Student:', res.data.studentName);
  console.log('Skills:', res.data.studentSkills);
  console.log('Current Match Score:', res.data.currentMatchScore + '%');
  console.log('Recommended Skills to Learn:', res.data.recommendedSkills);
  console.log('Total Opportunities Evaluated:', res.data.recommendations.length);

  console.log('\nTop 3 Recommendations:');
  res.data.recommendations.slice(0, 3).forEach((r, idx) => {
    console.log(`[${idx+1}] ${r.title} (${r.company}) - ${r.type}`);
    console.log(`    AI Match: ${r.matchScore}%`);
    console.log(`    Matched: ${r.matchedSkills.join(', ')}`);
    console.log(`    Missing: ${r.missingSkills.join(', ') || 'None'}`);
    console.log(`    Why: "${r.reason}"`);
  });

  console.log('\n--- Testing Guest Recommendations (Python / ML student) ---');
  const guestRes = await mockStore.getGuestRecommendations({ skills: 'Python, Machine Learning, SQL' });
  const topGuest = guestRes.data.recommendations[0];
  console.log(`Top Guest Match: ${topGuest.title} (${topGuest.company}) - Match: ${topGuest.matchScore}%`);
  console.log(`    Matched: ${topGuest.matchedSkills.join(', ')}`);
  console.log(`    Missing: ${topGuest.missingSkills.join(', ') || 'None'}`);
  console.log(`    Why: "${topGuest.reason}"`);
}

run().catch(console.error);
