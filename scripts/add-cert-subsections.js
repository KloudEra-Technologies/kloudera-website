const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSubSections() {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'website_content' } });
    if (!config) {
      console.log('No DB content found.');
      return;
    }
    const data = JSON.parse(config.value);
    if (!data.certifications) data.certifications = {};
    if (!data.certifications.subSections) {
      data.certifications.subSections = ['General'];
    }
    await prisma.systemConfig.update({
      where: { key: 'website_content' },
      data: { value: JSON.stringify(data) }
    });
    console.log('SUCCESS: subSections added to certifications in database.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

addSubSections();
