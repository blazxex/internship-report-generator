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
      : format(date, "MM/dd/yyyy");
  } catch (e) {
    return dateString;
  }
};
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
export const exportToPdf = (
  report: Report,
  profile: Profile,
  language: "th" | "en",
  previousTotalHours: number
): void => {
  const doc = new jsPDF();
  doc.setFont("THSarabunNew", "normal"); // Use a Thai-compatible font if needed
  doc.setFontSize(16);

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.text(
    language === "th"
      ? "รายงานการฝึกงานทุกสองสัปดาห์"
      : "Internship Bi-weekly Report",
    pageWidth / 2,
    20,
    { align: "center" }
  );
  doc.setFontSize(12);
  doc.text(profile.department, pageWidth / 2, 30, { align: "center" });
  doc.text(
    language === "th" ? `ฉบับที่ ${report.id}` : `No. ${report.id}`,
    pageWidth / 2,
    40,
    { align: "center" }
  );

  // Student Info
  doc.setFontSize(11);
  doc.text(
    `${language === "th" ? "ชื่อ - สกุล" : "Name - Surname"}: ${
      profile.firstName
    } ${profile.lastName}`,
    20,
    55
  );
  doc.text(
    `${language === "th" ? "รหัสนิสิต" : "Student ID"}: ${profile.studentId}`,
    20,
    63
  );
  doc.text(
    `${
      language === "th" ? "ชื่อหน่วยงานที่ฝึกงาน" : "Internship institution"
    }: ${profile.companyName}`,
    20,
    71
  );

  // Table headers
  const headers = [
    language === "th"
      ? ["วัน/เดือน/ปี", "จำนวนชม.", "งานที่ปฏิบัติโดยย่อ", "ลงนาม(นิสิต)"]
      : ["Date", "Hours", "Description", "Student Signature"],
  ];

  // Pad rows to 15 like DOCX
  const maxRows = 15;
  const data = [
    ...report.entries.map((entry) => [
      formatDate(entry.date, language),
      entry.hours,
      entry.description,
      "",
    ]),
  ];

  while (data.length < maxRows) {
    data.push(["", "", "", ""]);
  }

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 80,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 100 },
      3: { cellWidth: 30 },
    },
  });

  const summaryY = (doc as any).lastAutoTable.finalY + 10;

  // Summary Table
  autoTable(doc, {
    body: [
      [
        language === "th"
          ? "จำนวนชม.ฝึกงานทั้งหมด\nในรายงานฉบับนี้"
          : "Total hours\nin this report",
        String(report.totalHours),
      ],
      [
        language === "th"
          ? "จำนวนชม.ฝึกงานทั้งหมด\nจากรายงานฉบับก่อนหน้า"
          : "Total hours\nfrom previous reports",
        String(previousTotalHours),
      ],
      [
        language === "th"
          ? "จำนวนชม.ฝึกงานทั้งหมด\nในปัจจุบัน"
          : "Current\ntotal hours",
        String(report.totalHours + previousTotalHours),
      ],
    ],
    startY: summaryY,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 40, halign: "center" },
    },
  });

  const certY = (doc as any).lastAutoTable.finalY + 20;

  // Certification block
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
      ? "ลงชื่อ ................................................................................. วิศวกรผู้ควบคุม"
      : "Supervisor signature .................................................................................",
    pageWidth / 2,
    certY + 12,
    { align: "center" }
  );

  doc.text(`(${profile.supervisorName})`, pageWidth / 2, certY + 22, {
    align: "center",
  });

  doc.text(
    language === "th"
      ? `ตำแหน่ง ${profile.supervisorPosition}`
      : `Title: ${profile.supervisorPosition}`,
    pageWidth / 2,
    certY + 30,
    { align: "center" }
  );

  doc.text(
    language === "th"
      ? "วันที่ ................................................................................."
      : "Date .................................................................................",
    pageWidth / 2,
    certY + 38,
    { align: "center" }
  );

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
