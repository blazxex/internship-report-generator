import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  VerticalAlign,
} from "docx";

import FileSaver from "file-saver"; // Fixed import
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import type { Report } from "@/context/internship-context";

// Define the profile type
interface Profile {
  firstName: string;
  lastName: string;
  studentId: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  supervisorName: string;
  supervisorPosition: string;
  department: string;
}

// Format date for display
const formatDate = (dateString: string, language: "th" | "en") => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return language === "th"
      ? format(date, "dd/MM/yyyy", { locale: th })
      : format(date, "dd/MM/yyyy");
  } catch (e) {
    return dateString;
  }
};
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
const wrapText = (text: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        font: "Cordia New",
        size: 30,
      }),
    ],
    alignment: AlignmentType.LEFT,
  });

// Export to PDF
export const exportToPdf = async (
  report: Report,
  profile: {
    firstName: string;
    lastName: string;
    studentId: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    supervisorName: string;
    supervisorPosition: string;
    department: string;
  },
  language: "th" | "en",
  previousTotalHours: number
) => {
  // 1) Create the PDF
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // 2) Fetch the TTF from /public and embed it
  const res = await fetch("/Sarabun-Regular.ttf");
  const buffer = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  doc.addFileToVFS("Sarabun-Regular.ttf", base64);
  doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
  doc.setFont("Sarabun", "normal");

  // 3) Header
  doc.setFontSize(16);
  doc.text(
    language === "th"
      ? "รายงานการฝึกงานทุกสองสัปดาห์"
      : "Internship Bi-weekly Report",
    pageWidth / 2,
    60,
    { align: "center" }
  );
  doc.setFontSize(12);
  doc.text(profile.department, pageWidth / 2, 80, { align: "center" });
  doc.text(
    language === "th" ? `ฉบับที่ ${report.id}` : `No. ${report.id}`,
    pageWidth / 2,
    100,
    { align: "center" }
  );

  // 4) Student info
  doc.setFontSize(11);
  doc.text(
    `${language === "th" ? "ชื่อ – สกุล" : "Name - Surname"}: ${
      profile.firstName
    } ${profile.lastName}`,
    margin,
    130
  );
  doc.text(
    `${language === "th" ? "รหัสนิสิต" : "Student ID"}: ${profile.studentId}`,
    margin,
    150
  );
  doc.text(
    `${
      language === "th" ? "ชื่อหน่วยงานที่ฝึกงาน" : "Internship Institution"
    }: ${profile.companyName}`,
    margin,
    170
  );

  // 5) Main entries table
  const headers = [
    language === "th"
      ? ["วัน/เดือน/ปี", "จำนวนชม.", "งานที่ปฏิบัติโดยย่อ", "ลงนาม(นิสิต)"]
      : ["Date", "Hours", "Description", "Student Signature"],
  ];
  const data = report.entries.map((e) => [
    formatDate(e.date, language),
    e.hours,
    e.description,
    "",
  ]);
  while (data.length < 15) data.push(["", "", "", ""]);

  (autoTable as any)(doc, {
    head: headers,
    body: data,
    startY: 190,
    theme: "grid",
    headStyles: {
      fillColor: null,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      halign: "center",
      valign: "middle",
      font: "Sarabun",
    },
    bodyStyles: {
      fillColor: null,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      valign: "middle",
      overflow: "linebreak",
      font: "Sarabun",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 80, halign: "center" },
      1: { cellWidth: 50, halign: "center" },
      2: {
        cellWidth:
          pageWidth - margin * 2 - /*col0*/ 80 - /*col1*/ 50 - /*col3*/ 80,
      },
      3: { cellWidth: 80, halign: "center" },
    },
    margin: { left: margin, right: margin },
  } as UserOptions);

  // 6) Summary table
  const summaryY = (doc as any).lastAutoTable.finalY + 30;
  (autoTable as any)(doc, {
    startY: summaryY,
    theme: "grid",
    body: [
      [
        language === "th"
          ? "จำนวนชม.ทั้งหมด\nในรายงานฉบับนี้"
          : "Total hours\nin this report",
        String(report.totalHours),
      ],
      [
        language === "th"
          ? "จำนวนชม.ทั้งหมด\nจากรายงานก่อนหน้า"
          : "Total hours\nfrom previous reports",
        String(previousTotalHours),
      ],
      [
        language === "th"
          ? "จำนวนชม.ทั้งหมด\nปัจจุบัน"
          : "Current\ntotal hours",
        String(report.totalHours + previousTotalHours),
      ],
    ],
    headStyles: { fillColor: null, lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { fillColor: null, lineColor: [0, 0, 0], lineWidth: 0.5 },
    styles: {
      font: "Sarabun",
      fontSize: 10,
      cellPadding: 4,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { cellWidth: 80, halign: "center" },
    },
    margin: { left: margin },
  });

  // 7) Certification block
  const certY = (doc as any).lastAutoTable.finalY + 40;
  doc.setFontSize(12);
  doc.text(
    language === "th"
      ? "ขอรับรองว่ารายงานนี้เป็นความจริงทุกประการ"
      : "I certify that this report is truthful.",
    pageWidth / 2,
    certY,
    { align: "center" }
  );
  doc.text(
    language === "th"
      ? "ลงชื่อ ........................................ วิศวกรผู้ควบคุม"
      : "Supervisor signature ...............................",
    pageWidth / 2,
    certY + 20,
    { align: "center" }
  );
  doc.text(`(${profile.supervisorName})`, pageWidth / 2, certY + 40, {
    align: "center",
  });
  doc.text(
    language === "th"
      ? `ตำแหน่ง ${profile.supervisorPosition}`
      : `Title: ${profile.supervisorPosition}`,
    pageWidth / 2,
    certY + 60,
    { align: "center" }
  );
  doc.text(
    language === "th"
      ? "วันที่ ........................................................"
      : "Date ........................................................",
    pageWidth / 2,
    certY + 80,
    { align: "center" }
  );

  // 8) Save
  const fileName =
    language === "th"
      ? `รายงานฝึกงาน_ฉบับที่_${report.id}.pdf`
      : `Internship_Report_${report.id}.pdf`;
  doc.save(fileName);
};

const allBorders = {
  top: { style: BorderStyle.SINGLE, size: 1 },
  bottom: { style: BorderStyle.SINGLE, size: 1 },
  left: { style: BorderStyle.SINGLE, size: 1 },
  right: { style: BorderStyle.SINGLE, size: 1 },
};
// Export to DOCX
export const exportToDocx = async (
  report: Report,
  profile: Profile,
  language: "th" | "en",
  previousTotalHours: number
): Promise<void> => {
  // Headers
  const headers = [
    language === "th" ? "วัน/เดือน/ปี" : "Date",
    language === "th" ? "จำนวนชม." : "Hours",
    language === "th" ? "งานที่ปฏิบัติโดยย่อ" : "Description",
    language === "th" ? "ลงนาม(นิสิต)" : "Student Signature",
  ];

  // Actual + padding to 15 rows
  const entryRows: TableRow[] = report.entries.map((entry) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: formatDate(entry.date, language),
              alignment: AlignmentType.CENTER,
            }),
          ],

          borders: allBorders,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(entry.hours),
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: allBorders,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: entry.description,
              alignment: AlignmentType.LEFT,
            }),
          ],
          borders: allBorders,
        }),
        new TableCell({ children: [new Paragraph("")], borders: allBorders }),
      ],
    });
  });

  const emptyRows: TableRow[] = Array.from({
    length: 15 - entryRows.length,
  }).map(
    () =>
      new TableRow({
        children: Array(4)
          .fill(null)
          .map(
            () =>
              new TableCell({
                children: [new Paragraph("")],
                borders: allBorders,
              })
          ),
      })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Cordia New (Body CS)",
            size: 30, // 15 pt
          },
        },
      },
    },
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text:
                  language === "th"
                    ? "รายงานการฝึกงานทุกสองสัปดาห์"
                    : "Internship Bi-weekly Report",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: profile.department,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            text:
              language === "th" ? `ฉบับที่ ${report.id}` : `No. ${report.id}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: " " }),
          new Paragraph({
            children: [
              new TextRun(
                language === "th" ? "ชื่อ – สกุล " : "Name - Surname "
              ),
              new TextRun(` ${profile.firstName} ${profile.lastName}    `),
              new TextRun(language === "th" ? "รหัสนิสิต " : "Student ID "),
              new TextRun(profile.studentId),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                language === "th"
                  ? "ชื่อหน่วยงานที่ฝึกงาน "
                  : "Internship institution "
              ),
              new TextRun(profile.companyName),
            ],
          }),
          new Paragraph({ text: " " }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            rows: [
              // Header row
              new TableRow({
                children: headers.map(
                  (h) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: h,
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      borders: allBorders,
                    })
                ),
              }),

              // Center-align every cell in entryRows
              ...entryRows,
              ...emptyRows,
            ],
          }),

          new Paragraph({ text: " " }),

          new Table({
            width: { size: 3168, type: WidthType.DXA },
            alignment: AlignmentType.LEFT,
            rows: [
              new TableRow({
                height: { value: 750, rule: "exact" },
                children: [
                  new TableCell({
                    width: { size: 2448, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              language === "th"
                                ? "จำนวนชม.ฝึกงานทั้งหมด"
                                : "Total hours in this",
                          }),
                          new TextRun({
                            text:
                              language === "th" ? "รายงานฉบับนี้ใน" : "report",
                            break: 1, // ← This breaks to new line
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 720, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: String(report.totalHours),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                height: { value: 750, rule: "exact" },
                children: [
                  new TableCell({
                    width: { size: 2448, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              language === "th"
                                ? "จำนวนชม.ฝึกงานทั้งหมด"
                                : "Total hours from",
                          }),
                          new TextRun({
                            text:
                              language === "th"
                                ? "จากรายงานฉบับก่อนหน้า"
                                : "previous reports",

                            break: 1,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 720, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: String(previousTotalHours),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                height: { value: language === "th" ? 760 : 400, rule: "exact" },

                children: [
                  new TableCell({
                    width: { size: 2448, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text:
                              language === "th"
                                ? "จำนวนชม.ฝึกงานทั้งหมดใน"
                                : "Current total hours",
                          }),
                          new TextRun({
                            text: language === "th" ? "ปัจจุบัน" : "",

                            break: 1,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 720, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    borders: allBorders,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: String(
                              report.totalHours + previousTotalHours
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: " " }),
          new Paragraph({
            text:
              language === "th"
                ? "ขอรับรองว่ารายงานนี้เป็นความจริงทุกประการ"
                : "I certify that this report is truthful.",
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: " " }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  language === "th"
                    ? "ลงชื่อ ................................................................................. วิศวกรผู้ควบคุม"
                    : "Supervisor signature .................................................................................",
              }),
            ],
            alignment: AlignmentType.CENTER,
            indent: {
              left: 936, // 0.65 inches in twips
            },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `         (${profile.supervisorName})`,
              }),
            ],
            alignment: AlignmentType.LEFT,
            indent: { left: 2016 }, // 1.4 inches
          }),
          new Paragraph({
            text:
              language === "th"
                ? `ตำแหน่ง ${profile.supervisorPosition}`
                : `Title: ${profile.supervisorPosition}`,
            alignment: AlignmentType.LEFT,
            indent: { left: 2016 },
          }),
          new Paragraph({
            text:
              language === "th"
                ? "วันที่ ................................................................................."
                : "Date .................................................................................",
            alignment: AlignmentType.LEFT,
            indent: { left: 2016 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const fileName =
    language === "th"
      ? `รายงานฝึกงาน_ฉบับที่_${report.id}.docx`
      : `Internship_Report_${report.id}.docx`;
  FileSaver.saveAs(blob, fileName);
};
