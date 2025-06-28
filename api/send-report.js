import nodemailer from 'nodemailer';
import XLSX from 'xlsx';

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

  // Create Excel file buffer
  const worksheet = XLSX.utils.json_to_sheet(items.map(item => ({
    'קוד פריט': item.code,
    'שם פריט': item.name,
    'משקל נטו (ק"ג)': item.net
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'דוח מלאי');
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  const now = new Date();
  const formattedDate = now.toLocaleString('he-IL', { hour12: false });
  const subject = `דוח ספירת מלאי מחלקת בשר לתאריך ${formattedDate}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to || 'ashraf@khader.co.il',
      subject,
      html: `<p>מצורף דוח ספירת מלאי שהופק בתאריך <strong>${formattedDate}</strong>.</p>`,
      attachments: [
        {
          filename: `report-${formattedDate.replace(/[: ]/g, '_')}.xlsx`,
          content: excelBuffer,
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
