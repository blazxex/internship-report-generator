"use client";
import { useState, useEffect } from "react";

import {
  useInternship,
  type Report,
  type ReportEntry,
} from "@/context/internship-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  FileDown,
  FileIcon as FilePdf,
  Languages,
  Eye,
  EyeOff,
  Trash,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { format, addDays, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { exportToPdf, exportToDocx } from "@/utils/document-export";
import { useToast } from "@/components/ui/use-toast";

export default function ReportsPage() {
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    reports,
    setReports,
    language,
    setLanguage,
    profile,
    showPreview,
    setShowPreview,
    saveReports,
    loading,
  } = useInternship();
  useEffect(() => {
    if (!selectedReportId && showPreview) {
      setShowPreview(false); // hide preview when user closes all tabs
    }
  }, [selectedReportId, showPreview]);

  const deleteReport = async (reportId: string) => {
    try {
      setIsSaving(true);
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
      await saveReports();
      toast({
        title: "ลบรายงานเรียบร้อยแล้ว",
        description: "รายงานถูกลบออกจากระบบเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรายงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setReportToDelete(null);
    }
  };

  // Add a new entry to a report with auto-incrementing date
  const addEntry = (reportId: string) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          const lastEntry = report.entries[report.entries.length - 1];
          let newDate = "";

          // Auto-increment date by 1 day if the last entry has a valid date
          if (lastEntry && lastEntry.date) {
            try {
              const nextDate = addDays(parseISO(lastEntry.date), 1);
              newDate = format(nextDate, "yyyy-MM-dd");
            } catch (e) {
              // If date parsing fails, leave empty
              newDate = "";
            }
          }

          const newEntry: ReportEntry = {
            id: `${reportId}-${Date.now()}`, // or use uuid()
            date: newDate,
            hours: "8",
            description: "",
          };

          return {
            ...report,
            entries: [...report.entries, newEntry],
          };
        }
        return report;
      })
    );
  };

  // Update an entry in a report
  const updateEntry = async (
    reportId: string,
    entryId: string,
    field: keyof ReportEntry,
    value: string
  ) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          const updatedEntries = report.entries.map((entry) => {
            if (entry.id === entryId) {
              return { ...entry, [field]: value };
            }
            return entry;
          });

          // Recalculate total hours
          const totalHours = updatedEntries.reduce((total, entry) => {
            return total + (Number(entry.hours) || 0);
          }, 0);

          return {
            ...report,
            entries: updatedEntries,
            totalHours,
          };
        }
        return report;
      })
    );
  };

  const deleteEntry = (reportId: string, entryId: string) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          const updatedEntries = report.entries.filter(
            (entry) => entry.id !== entryId
          );
          const totalHours = updatedEntries.reduce((total, entry) => {
            return total + (Number(entry.hours) || 0);
          }, 0);

          return {
            ...report,
            entries: updatedEntries,
            totalHours,
          };
        }
        return report;
      })
    );
  };

  // Add a new report
  const addReport = async () => {
    try {
      setIsSaving(true);
      const newReportId = (reports.length + 1).toString();
      const newReport: Report = {
        id: newReportId,
        entries: [
          {
            id: `${newReportId}-1`,
            date: "",
            hours: "",
            description: "",
          },
        ],
        totalHours: 0,
      };

      setReports([...reports, newReport]);
      await saveReports();

      toast({
        title: "เพิ่มรายงานใหม่เรียบร้อยแล้ว",
        description: `รายงานที่ ${newReportId} ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มรายงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save report changes
  const saveReportChanges = async () => {
    try {
      setIsSaving(true);
      await saveReports();
      toast({
        title: "บันทึกรายงานเรียบร้อยแล้ว",
        description: "รายงานของคุณถูกบันทึกเข้าสู่ระบบเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกรายงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate previous total hours
  const getPreviousTotalHours = (reportId: string): number => {
    const currentReportIndex = reports.findIndex(
      (report) => report.id === reportId
    );
    if (currentReportIndex <= 0) return 0;

    return reports
      .slice(0, currentReportIndex)
      .reduce((total, report) => total + report.totalHours, 0);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
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

  // Handle export to PDF
  const handleExportToPdf = (report: Report) => {
    exportToPdf(report, profile, language, getPreviousTotalHours(report.id));
  };

  // Handle export to DOCX
  const handleExportToDocx = (report: Report) => {
    exportToDocx(report, profile, language, getPreviousTotalHours(report.id));
  };

  // Toggle preview panel
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  const selectedReport = reports.find((r) => r.id === selectedReportId);
  const shouldShowPreview = showPreview && selectedReport !== undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === "th" ? "รายงานประจำสัปดาห์" : "Bi-Weekly Reports"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th"
              ? "บันทึกกิจกรรมและชั่วโมงการฝึกงานของคุณ"
              : "Record your internship activities and hours"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="language-toggle"
              checked={language === "en"}
              onCheckedChange={(checked) => setLanguage(checked ? "en" : "th")}
            />
            <Label htmlFor="language-toggle" className="flex items-center">
              <Languages className="mr-2 h-4 w-4" />
              {language === "th" ? "EN" : "TH"}
            </Label>
          </div>
          <Button variant="outline" onClick={togglePreview}>
            {showPreview ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                {language === "th" ? "ซ่อนตัวอย่าง" : "Hide Preview"}
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                {language === "th" ? "แสดงตัวอย่าง" : "Show Preview"}
              </>
            )}
          </Button>
          <Button onClick={addReport} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {language === "th" ? "เพิ่มรายงานใหม่" : "Add New Report"}
          </Button>
        </div>
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: showPreview ? "2fr 1fr" : "1fr" }}
      >
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={selectedReportId ?? undefined}
            onValueChange={(val) => setSelectedReportId(val)}
          >
            {reports.map((report) => (
              <AccordionItem key={report.id} value={report.id}>
                <AccordionTrigger className="text-lg font-medium">
                  {language === "th"
                    ? `รายงานที่ ${report.id}`
                    : `Report #${report.id}`}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">
                            {language === "th" ? "วันที่" : "Date"}
                          </TableHead>
                          <TableHead className="w-[100px]">
                            {language === "th" ? "จำนวนชั่วโมง" : "Hours"}
                          </TableHead>
                          <TableHead>
                            {language === "th"
                              ? "รายละเอียดงาน"
                              : "Description"}
                          </TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {report.entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <Input
                                type="date"
                                value={entry.date}
                                onChange={(e) =>
                                  updateEntry(
                                    report.id,
                                    entry.id,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                max={24}
                                value={entry.hours}
                                onChange={(e) =>
                                  updateEntry(
                                    report.id,
                                    entry.id,
                                    "hours",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={entry.description}
                                onChange={(e) =>
                                  updateEntry(
                                    report.id,
                                    entry.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteEntry(report.id, entry.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => addEntry(report.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {language === "th" ? "เพิ่มแถว" : "Add Row"}
                      </Button>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleExportToDocx(report)}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          {language === "th" ? "DOCX" : "Export as DOCX"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleExportToPdf(report)}
                        >
                          <FilePdf className="mr-2 h-4 w-4" />
                          {language === "th" ? "PDF" : "Export as PDF"}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-2">
                      <div className="flex justify-between">
                        <Label>
                          {language === "th"
                            ? "จำนวนชั่วโมงในรายงานนี้:"
                            : "Total hours in this report:"}
                        </Label>
                        <span>
                          {report.totalHours}{" "}
                          {language === "th" ? "ชั่วโมง" : "hours"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <Label>
                          {language === "th"
                            ? "จำนวนชั่วโมงจากรายงานก่อนหน้า:"
                            : "Total hours from previous reports:"}
                        </Label>
                        <span>
                          {getPreviousTotalHours(report.id)}{" "}
                          {language === "th" ? "ชั่วโมง" : "hours"}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <Label>
                          {language === "th"
                            ? "จำนวนชั่วโมงรวมทั้งหมด:"
                            : "Current total hours:"}
                        </Label>
                        <span>
                          {report.totalHours + getPreviousTotalHours(report.id)}{" "}
                          {language === "th" ? "ชั่วโมง" : "hours"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button onClick={saveReportChanges} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {language === "th" ? "บันทึกรายงาน" : "Save Report"}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setReportToDelete(report)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            {language === "th" ? "ลบรายงาน" : "Delete Report"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {language === "th"
                                ? "ยืนยันการลบรายงาน"
                                : "Confirm Report Deletion"}
                            </DialogTitle>
                          </DialogHeader>
                          <p className="text-sm">
                            {language === "th"
                              ? "คุณแน่ใจหรือไม่ว่าต้องการลบรายงานนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                              : "Are you sure you want to delete this report? This action cannot be undone."}
                          </p>
                          <DialogFooter className="pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setReportToDelete(null)}
                            >
                              {language === "th" ? "ยกเลิก" : "Cancel"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteReport(reportToDelete?.id!)}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              {language === "th" ? "ลบรายงาน" : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {shouldShowPreview && (
          <div className="transition-all duration-300 ease-in-out">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {language === "th" ? "ตัวอย่างเอกสาร" : "Document Preview"}
                  </h3>
                  <div className="rounded-lg border p-4 space-y-4 min-h-[500px] overflow-auto max-h-[calc(100vh-200px)]">
                    {language === "th" ? (
                      // Thai report template
                      <div className="text-sm">
                        <div className="text-center space-y-2">
                          <h4 className="font-bold">
                            รายงานการฝึกงานทุกสองสัปดาห์
                          </h4>
                          <p>{profile.department}</p>
                          <p>
                            ฉบับที่ {selectedReport ? selectedReport.id : "..."}
                          </p>
                          <p>
                            ชื่อ - สกุล {profile.firstName} {profile.lastName}{" "}
                            รหัสนิสิต {profile.studentId}
                          </p>
                          <p>ชื่อหน่วยงานที่ฝึกงาน {profile.companyName}</p>
                        </div>

                        <Table className="mt-4 w-full table-fixed">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                วัน/เดือน/ปี
                              </TableHead>
                              <TableHead className="w-[80px]">
                                จำนวนชม.
                              </TableHead>
                              <TableHead>งานที่ปฏิบัติโดยย่อ</TableHead>
                              <TableHead className="w-[80px]">
                                ลงนาม(นิสิต)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reports.length > 0 &&
                              selectedReport.entries.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell className="truncate">
                                    {formatDate(entry.date)}
                                  </TableCell>
                                  <TableCell className="truncate">
                                    {entry.hours}
                                  </TableCell>
                                  <TableCell className="truncate">
                                    {entry.description}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>

                        <div className="space-y-2 pt-4">
                          <div className="flex justify-between">
                            <span>จำนวนชม.ฝึกงานทั้งหมดในรายงานฉบับนี้:</span>
                            <span>
                              {reports.length > 0
                                ? selectedReport.totalHours
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              จำนวนชม.ฝึกงานทั้งหมดจากรายงานฉบับก่อนหน้า:
                            </span>
                            <span>
                              {reports.length > 0
                                ? getPreviousTotalHours(selectedReport.id)
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>จำนวนชม.ฝึกงานทั้งหมดในปัจจุบัน:</span>
                            <span>
                              {reports.length > 0
                                ? selectedReport.totalHours +
                                  getPreviousTotalHours(selectedReport.id)
                                : 0}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 text-center">
                          <p>ขอรับรองว่ารายงานนี้เป็นความจริงทุกประการ</p>
                          <div className="mt-4">
                            <p>
                              ลงชื่อ
                              .................................................................................
                              วิศวกรผู้ควบคุม
                            </p>
                            <p>({profile.supervisorName})</p>
                            <p>ตำแหน่ง {profile.supervisorPosition}</p>
                            <p>
                              วันที่
                              ...........................................................................
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // English report template
                      <div className="text-sm">
                        <div className="text-center space-y-2">
                          <h4 className="font-bold">
                            Internship Bi-weekly Report
                          </h4>
                          <p>Computer Engineering Department</p>
                          <p>
                            No. {reports.length > 0 ? selectedReport.id : "..."}
                          </p>
                          <p>
                            Name - Surname: {profile.firstName}{" "}
                            {profile.lastName} Student ID: {profile.studentId}
                          </p>
                          <p>Internship institution: {profile.companyName}</p>
                        </div>

                        <Table className="mt-4 w-full table-fixed">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Date</TableHead>
                              <TableHead className="w-[80px]">Hours</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[80px]">
                                Student Signature
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reports.length > 0 &&
                              selectedReport.entries.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell className="truncate">
                                    {formatDate(entry.date)}
                                  </TableCell>
                                  <TableCell className="truncate">
                                    {entry.hours}
                                  </TableCell>
                                  <TableCell className="truncate">
                                    {entry.description}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>

                        <div className="space-y-2 pt-4">
                          <div className="flex justify-between">
                            <span>Total hours in this report:</span>
                            <span>
                              {reports.length > 0
                                ? selectedReport.totalHours
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total hours from previous reports:</span>
                            <span>
                              {reports.length > 0
                                ? getPreviousTotalHours(selectedReport.id)
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current total hours:</span>
                            <span>
                              {reports.length > 0
                                ? selectedReport.totalHours +
                                  getPreviousTotalHours(selectedReport.id)
                                : 0}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 text-center">
                          <p>I certify that this report is truthful.</p>
                          <div className="mt-4">
                            <p>
                              Supervisor signature
                              .................................................................................
                            </p>
                            <p>({profile.supervisorName})</p>
                            <p>Title: {profile.supervisorPosition}</p>
                            <p>
                              Date:
                              ...........................................................................
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
