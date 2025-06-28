import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { timestamp, items, to } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items list' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const tableHtml = items.map(item =>
    `<tr><td>${item.code}</td><td>${item.name}</td><td>${item.net} ק"ג</td></tr>`
  ).join('');

  const htmlBody = `
    <h2>דוח ספירת מלאי - ${timestamp}</h2>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>קוד פריט</th>
          <th>שם פריט</th>
          <th>משקל נטו מצטבר</th>
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to || 'ashraf@khader.co.il',
      subject: `📦 דוח ספירת מלאי - ${timestamp}`,
      html: htmlBody
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
