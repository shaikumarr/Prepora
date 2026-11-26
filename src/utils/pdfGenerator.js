import { jsPDF } from 'jspdf';

const BLUE = [37, 99, 235];
const INK = [15, 23, 42];

export function downloadPdf({ technology, experience, difficulty, items }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = 0;

  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 96, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`${technology} Interview Questions`, M, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${experience} | ${difficulty} | ${new Date().toLocaleDateString()} | AI Interview Generator`, M, 72);
  y = 130;

  const write = (text, size, style, color, gap = 0) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    for (const line of doc.splitTextToSize(String(text), W - 2 * M)) {
      if (y > H - M) { doc.addPage(); y = M; }
      doc.text(line, M, y);
      y += size * 1.45;
    }
    y += gap;
  };

  items.forEach((it, i) => {
    write(`Q${i + 1}. ${it.question}`, 12, 'bold', INK, 4);
    write(it.answer, 10.5, 'normal', [51, 65, 85], 16);
  });

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 24, { align: 'right' });
  }
  doc.save(`${technology.replace(/\s+/g, '-').toLowerCase()}-interview-questions.pdf`);
}