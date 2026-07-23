import PDFDocument from "pdfkit";
import { DEPT_CHANNELS_SHORT } from "@/lib/departments";

export interface PDFData {
  name: string;
  section: string;
  contractId: string;
  date?: string;
  hours?: string;
  email?: string;
}

export async function generateJoinDocumentPDF(data: PDFData): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const buffers: Buffer[] = [];
  doc.on("data", (b) => buffers.push(b));

  const { promise, resolve } = Promise.withResolvers<Buffer>();
  doc.on("end", () => resolve(Buffer.concat(buffers)));

  const joinDate = data.date || new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const deptChannel = getDeptChannel(data.section);

  doc.rect(30, 30, 535, 782).strokeColor("#27272a").lineWidth(1.5).stroke();

  doc.rect(50, 50, 495, 95).fillAndStroke("#18181b", "#3f3f46");
  doc.fillColor("#10b981").fontSize(22).text("iraqjemo labs", 50, 65, { align: "center" });
  doc.fillColor("#a1a1aa").fontSize(10).text("Research & Innovation Branch - LXD Co.", 50, 92, { align: "center" });
  doc.fillColor("#f4f4f5").fontSize(13).text(`JOIN DOCUMENT | WATHIQAT INTHIMAM`, 50, 110, { align: "center" });
  doc.fillColor("#10b981").fontSize(10).text(`Ref ID: ${data.contractId}`, 50, 126, { align: "center" });

  doc.moveDown(4.5);
  doc.fillColor("#10b981").fontSize(13).text("MEMBER & APPOINTMENT DETAILS", 60);
  doc.rect(60, doc.y + 4, 475, 1).fill("#27272a");

  doc.moveDown(0.8);
  doc.fillColor("#e4e4e7").fontSize(11);
  doc.text(`Candidate Name: ${data.name}`);
  doc.text(`Department: ${data.section}`);
  doc.text(`Available Hours: ${data.hours || "As agreed"}`);
  doc.text(`Date of Joining: ${joinDate}`);
  doc.text(`Reference Code (Contract ID): ${data.contractId}`);

  doc.moveDown(1.5);
  doc.fillColor("#10b981").fontSize(13).text("TERMS OF JOINING & GUIDELINES");
  doc.rect(60, doc.y + 4, 475, 1).fill("#27272a");

  doc.moveDown(0.8);
  doc.fillColor("#d4d4d8").fontSize(10).lineGap(5);
  doc.text("1. Intellectual Property & Credit: Produced work is published under iraqjemo labs while fully preserving author credit.");
  doc.text("2. Department Engagement: Commitment to department leads, guidelines, and agreed timelines.");
  doc.text("3. Confidentiality: Work products & internal assets should not be distributed externally without prior clearance.");
  doc.text("4. Voluntary Status: Members can exit at any time by giving prior notice to their department lead.");
  doc.text("5. Non-Profit Principles: Membership is non-commercial. No hidden fees or financial obligations.");

  doc.moveDown(1.5);
  doc.rect(60, doc.y, 475, 70).fillAndStroke("#18181b", "#27272a");
  const boxY = doc.y - 65;
  doc.fillColor("#a1a1aa").fontSize(9).text("BY APPLYING AND ACCEPTING, YOU ACKNOWLEDGE AGREEMENT TO THE TERMS ABOVE.", 70, boxY + 10, { align: "center" });
  doc.fillColor("#10b981").fontSize(10).text(`Digital Signature Verified: ${data.contractId}`, 70, boxY + 30, { align: "center" });
  doc.fillColor("#71717a").fontSize(9).text(`Issued Date: ${joinDate}`, 70, boxY + 46, { align: "center" });

  doc.fillColor("#52525b").fontSize(8).text("iraqjemo labs (LXD Co.) - Page 1 of 2", 50, 785, { align: "center" });

  doc.addPage();

  doc.rect(30, 30, 535, 782).strokeColor("#27272a").lineWidth(1.5).stroke();

  doc.rect(50, 50, 495, 75).fillAndStroke("#18181b", "#3f3f46");
  doc.fillColor("#10b981").fontSize(20).text("QUICK START GUIDE", 50, 65, { align: "center" });
  doc.fillColor("#e4e4e7").fontSize(11).text("Welcome to the team! Here are your next steps:", 50, 95, { align: "center" });

  doc.moveDown(4.5);
  doc.fillColor("#10b981").fontSize(13).text("FIRST STEPS FOR NEW MEMBERS", 60);
  doc.rect(60, doc.y + 4, 475, 1).fill("#27272a");

  doc.moveDown(1);
  doc.fillColor("#e4e4e7").fontSize(11).lineGap(7);
  doc.text(`Step 1: Join your official department Telegram channel:`);
  doc.fillColor("#10b981").text(`   --> ${deptChannel}`);

  doc.fillColor("#e4e4e7");
  doc.text("Step 2: Introduce yourself in the channel (Name + Specialty + Project Interest).");
  doc.text("Step 3: Read pinned messages for guidelines, rules, and current active projects.");
  doc.text("Step 4: Connect with your department supervisor to get added to active workgroups.");
  doc.text("Step 5: Get assigned your first research/dev task (announced in channel).");

  doc.moveDown(2);
  doc.fillColor("#10b981").fontSize(13).text("OFFICIAL DIRECTORY & CHANNELS");
  doc.rect(60, doc.y + 4, 475, 1).fill("#27272a");

  doc.moveDown(0.8);
  doc.fillColor("#d4d4d8").fontSize(10).lineGap(4);
  doc.text("• Main Telegram Channel: t.me/iraqjemo");
  doc.text("• Official Website: jemo-labs.com");
  doc.text("• Contact Email: admin@jemo-labs.com");
  doc.text("• Telegram Bot: t.me/jemo_coBot");

  doc.rect(50, 710, 495, 55).fillAndStroke("#18181b", "#27272a");
  doc.fillColor("#a1a1aa").fontSize(9).text("iraqjemo labs © 2026 - Non-profit Research & Innovation Branch of LXD Co.", 50, 725, { align: "center" });
  doc.fillColor("#52525b").fontSize(8).text("Page 2 of 2 - Document Reference: " + data.contractId, 50, 742, { align: "center" });

  doc.end();
  return promise;
}
function getDeptChannel(section: string): string {
  return DEPT_CHANNELS_SHORT[section] || "t.me/iraqjemo";
}
