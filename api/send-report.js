import nodemailer from 'nodemailer';
import ExcelJS from 'exceljs';

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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('דוח מלאי');

  worksheet.addRow(['קוד פריט', 'שם פריט', 'משקל נטו (ק"ג)']);

  items.forEach(item => {
    worksheet.addRow([
      item.code,
      item.name.replace(/^\[.*?\]\s*/, ''),
      item.net
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const now = new Date();
  const formattedDate = now.toLocaleString('he-IL', { hour12: false });
  const subject = `דוח ספירת מלאי מחלקת בשר לתאריך ${formattedDate}`;

  const recipients = [
    'ashraf@khader.co.il',
    'criem@plusgold.co.il',
    'khalid@plusgold.co.il',
    ...(Array.isArray(to) ? to : to ? [to] : [])
  ];

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject,
      html: `<p>מצורף דוח ספירת מלאי שהופק בתאריך <strong>${formattedDate}</strong>.</p>`,
      attachments: [
        {
          filename: `report-${formattedDate.replace(/[: ]/g, '_')}.xlsx`,
          content: buffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
