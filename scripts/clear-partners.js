const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearPartners() {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'website_content' } });
    if (!config) {
      console.log('No DB content found. DB is already clean.');
      return;
    }
    const data = JSON.parse(config.value);
    data.partners = {
      title: 'OUR STRATEGIC PARTNERS',
      tagline: 'KLOUDERA TECHNOLOGIES // GLOBAL ECOSYSTEM',
      introTitle: 'Our Technology Partners',
      introDesc: 'We work with world-class technology partners to deliver secure, scalable, and future-ready enterprise solutions.',
      featured: [],
      alliances: []
    };
    await prisma.systemConfig.update({
      where: { key: 'website_content' },
      data: { value: JSON.stringify(data) }
    });
    console.log('SUCCESS: Partners cleared from database.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearPartners();
