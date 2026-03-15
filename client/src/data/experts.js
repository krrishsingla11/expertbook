// Hardcoded experts data - no database needed

const generateSlots = () => {
  const slots = [];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];
    times.forEach((time) => {
      slots.push({ date: dateStr, time, isBooked: false });
    });
  }
  return slots;
};

const expertsData = [
  { _id: '1', name: 'Dr. Sarah Chen', category: 'Technology', experience: 12, rating: 4.9, bio: 'Former Google engineer specializing in AI/ML systems. PhD from MIT. Helped 200+ startups build scalable tech stacks.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah', hourlyRate: 250, skills: ['Machine Learning', 'System Design', 'Python', 'Cloud Architecture'] },
  { _id: '2', name: 'Marcus Williams', category: 'Finance', experience: 15, rating: 4.8, bio: 'Ex-Goldman Sachs VP. Specializes in startup fundraising, financial modeling, and M&A strategy.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=marcus', hourlyRate: 300, skills: ['Fundraising', 'Financial Modeling', 'VC Strategy', 'M&A'] },
  { _id: '3', name: 'Dr. Priya Patel', category: 'Health', experience: 18, rating: 4.9, bio: 'Board-certified physician and health tech consultant. Advisor to 3 unicorn health startups.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=priya', hourlyRate: 200, skills: ['Digital Health', 'Clinical Strategy', 'Regulatory Compliance', 'MedTech'] },
  { _id: '4', name: 'James Thornton', category: 'Legal', experience: 20, rating: 4.7, bio: 'Partner at top-50 law firm. Expert in startup law, IP protection, and international contracts.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=james', hourlyRate: 350, skills: ['IP Law', 'Contract Law', 'Startup Legal', 'Compliance'] },
  { _id: '5', name: 'Aisha Johnson', category: 'Marketing', experience: 10, rating: 4.8, bio: 'CMO coach and growth strategist. Scaled 3 SaaS companies from $0 to $50M ARR.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=aisha', hourlyRate: 220, skills: ['Growth Hacking', 'Brand Strategy', 'Content Marketing', 'Paid Acquisition'] },
  { _id: '6', name: 'Lena Müller', category: 'Design', experience: 8, rating: 4.9, bio: 'Ex-Apple design lead. Award-winning product designer with expertise in UX research and design systems.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=lena', hourlyRate: 190, skills: ['UX Design', 'Design Systems', 'User Research', 'Figma'] },
  { _id: '7', name: 'Prof. David Osei', category: 'Education', experience: 22, rating: 4.7, bio: 'Harvard professor and EdTech pioneer. Expert in curriculum design, learning science, and online education.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=david', hourlyRate: 175, skills: ['Curriculum Design', 'EdTech', 'Learning Science', 'Online Education'] },
  { _id: '8', name: 'Rachel Kim', category: 'Business', experience: 14, rating: 4.8, bio: '3x founder and YC alumni. Expert in product-market fit, operations, and scaling teams internationally.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rachel', hourlyRate: 275, skills: ['Product Strategy', 'Operations', 'Team Building', 'International Expansion'] },
  { _id: '9', name: 'Omar Hassan', category: 'Technology', experience: 9, rating: 4.6, bio: 'Full-stack architect and DevOps expert. Built infrastructure handling 100M+ requests/day.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=omar', hourlyRate: 210, skills: ['DevOps', 'Kubernetes', 'Node.js', 'PostgreSQL'] },
  { _id: '10', name: 'Sophie Laurent', category: 'Finance', experience: 11, rating: 4.7, bio: 'Crypto and DeFi specialist. Former CFO of 2 fintech unicorns. Expert in tokenomics and Web3 finance.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sophie', hourlyRate: 280, skills: ['DeFi', 'Tokenomics', 'CFO Advisory', 'Financial Strategy'] },
  { _id: '11', name: 'Carlos Rivera', category: 'Marketing', experience: 7, rating: 4.6, bio: 'Performance marketing expert. Managed $50M+ in ad spend with 10x average ROAS.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=carlos', hourlyRate: 180, skills: ['Paid Social', 'Google Ads', 'Attribution', 'CRO'] },
  { _id: '12', name: 'Nina Kowalski', category: 'Design', experience: 6, rating: 4.5, bio: 'Brand identity designer and creative director. Helped 100+ startups define their visual identity.', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=nina', hourlyRate: 160, skills: ['Brand Identity', 'Logo Design', 'Visual Strategy', 'Motion Design'] },
];

export const experts = expertsData.map((e) => ({ ...e, slots: generateSlots() }));

export const getExpertById = (id) => experts.find((e) => e._id === id) || null;
