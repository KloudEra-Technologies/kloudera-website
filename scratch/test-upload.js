const fs = require('fs');
const path = require('path');

async function testUpload() {
  const filePath = path.join(__dirname, 'test-logo.png');
  // Create a tiny dummy PNG file
  fs.writeFileSync(filePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'));

  try {
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'image/png' });
    formData.append('file', fileBlob, 'test-logo.png');
    formData.append('token', 'PasswordAdmin');
    formData.append('partnerName', 'Trend Micro');

    console.log("Sending POST request to /api/upload-image...");
    const res = await fetch('http://localhost:3000/api/upload-image', {
      method: 'POST',
      headers: {
        'x-developer-token': 'PasswordAdmin'
      },
      body: formData
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
  } catch (err) {
    console.error("Request failed:", err);
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

testUpload();
