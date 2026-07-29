const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearCertifications() {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'website_content' } });
    if (!config) {
      console.log('No DB content found. DB is already clean.');
      return;
    }
    const data = JSON.parse(config.value);
    data.certifications = {
      title: 'Security Compliance & Global Standards',
      intro: 'Kloudera operates under audited global security frameworks, data privacy laws, and quality management protocols.',
      items: []
    };
    await prisma.systemConfig.update({
      where: { key: 'website_content' },
      data: { value: JSON.stringify(data) }
    });
    console.log('SUCCESS: Certifications cleared from database.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearCertifications();
