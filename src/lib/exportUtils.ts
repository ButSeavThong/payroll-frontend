// src/lib/exportUtils.ts
// Frontend-only export utilities for payroll data (Excel & PDF)
// Uses: xlsx (SheetJS) and jspdf + jspdf-autotable

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  baseSalary: number;
  overtimePay: number;
  unpaidLeaveDeduction: number;
  unpaidLeaveDays: number;
  tax: number;
  netSalary: number;
  status: "GENERATED" | "PAID";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function usd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── ADMIN: Export monthly payroll as Excel ───────────────────────────────────

export function exportAdminPayrollToExcel(
  payrolls: PayrollRecord[],
  month: string,
) {
  const rows = payrolls.map((p) => ({
    Employee: p.employeeName,
    "Employee ID": p.employeeId,
    Month: p.month,
    "Base Salary ($)": p.baseSalary,
    "Overtime Pay ($)": p.overtimePay,
    "Unpaid Leave Days": p.unpaidLeaveDays,
    "Unpaid Deduction ($)": p.unpaidLeaveDeduction,
    "Tax 10% ($)": p.tax,
    "Net Salary ($)": p.netSalary,
    Status: p.status,
  }));

  // Summary row (looser type for totals line)
  const totalNet = payrolls.reduce((s, p) => s + p.netSalary, 0);
  const summaryRow = {
    Employee: "TOTAL",
    "Employee ID": 0,
    Month: month,
    "Base Salary ($)": payrolls.reduce((s, p) => s + p.baseSalary, 0),
    "Overtime Pay ($)": payrolls.reduce((s, p) => s + p.overtimePay, 0),
    "Unpaid Leave Days": payrolls.reduce((s, p) => s + p.unpaidLeaveDays, 0),
    "Unpaid Deduction ($)": payrolls.reduce(
      (s, p) => s + p.unpaidLeaveDeduction,
      0,
    ),
    "Tax 10% ($)": payrolls.reduce((s, p) => s + p.tax, 0),
    "Net Salary ($)": totalNet,
    Status: `${payrolls.filter((p) => p.status === "PAID").length}/${payrolls.length} PAID`,
  };

  const ws = XLSX.utils.json_to_sheet([...rows, summaryRow]);
  // Column widths
  ws["!cols"] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Payroll ${month}`);

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadFile(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Payroll_${month}.xlsx`,
  );
}

// ─── ADMIN: Export monthly payroll as PDF ────────────────────────────────────

export function exportAdminPayrollToPdf(
  payrolls: PayrollRecord[],
  month: string,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("HR Payroll Management System", 14, 16);

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Monthly Payroll Report — ${month}`, 14, 23);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US")}`, 14, 29);

  // Summary stats
  const totalNet = payrolls.reduce((s, p) => s + p.netSalary, 0);
  const paidCount = payrolls.filter((p) => p.status === "PAID").length;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Employees: ${payrolls.length}   |   Paid: ${paidCount}   |   Total Net Payout: ${usd(totalNet)}`,
    14,
    36,
  );

  // Table
  autoTable(doc, {
    startY: 41,
    head: [
      [
        "Employee",
        "Emp. ID",
        "Base Salary",
        "Overtime",
        "Unpaid Days",
        "Unpaid Deduction",
        "Tax (10%)",
        "Net Salary",
        "Status",
      ],
    ],
    body: payrolls.map((p) => [
      p.employeeName,
      String(p.employeeId),
      usd(p.baseSalary),
      p.overtimePay > 0 ? usd(p.overtimePay) : "—",
      p.unpaidLeaveDays > 0 ? String(p.unpaidLeaveDays) : "—",
      p.unpaidLeaveDeduction > 0 ? usd(p.unpaidLeaveDeduction) : "—",
      usd(p.tax),
      usd(p.netSalary),
      p.status,
    ]),
    foot: [
      [
        "TOTAL",
        "",
        usd(payrolls.reduce((s, p) => s + p.baseSalary, 0)),
        usd(payrolls.reduce((s, p) => s + p.overtimePay, 0)),
        String(payrolls.reduce((s, p) => s + p.unpaidLeaveDays, 0)),
        usd(payrolls.reduce((s, p) => s + p.unpaidLeaveDeduction, 0)),
        usd(payrolls.reduce((s, p) => s + p.tax, 0)),
        usd(totalNet),
        `${paidCount}/${payrolls.length}`,
      ],
    ],
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    footStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 35 },
      7: { textColor: [5, 150, 105], fontStyle: "bold" }, // net salary green
      8: { cellWidth: 18 },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`Payroll_${month}.pdf`);
}

// ─── EMPLOYEE: Export all payslips as Excel ───────────────────────────────────

export function exportEmployeePayslipToExcel(
  payrolls: PayrollRecord[],
  employeeName: string,
) {
  const sorted = [...payrolls].sort((a, b) => a.month.localeCompare(b.month));

  const rows = sorted.map((p) => ({
    Month: p.month,
    "Base Salary ($)": p.baseSalary,
    "Overtime Pay ($)": p.overtimePay,
    "Unpaid Leave Days": p.unpaidLeaveDays,
    "Unpaid Deduction ($)": p.unpaidLeaveDeduction,
    "Tax 10% ($)": p.tax,
    "Net Salary ($)": p.netSalary,
    Status: p.status,
  }));

  // Yearly totals
  const summaryRow = {
    Month: "TOTAL",
    "Base Salary ($)": sorted.reduce((s, p) => s + p.baseSalary, 0),
    "Overtime Pay ($)": sorted.reduce((s, p) => s + p.overtimePay, 0),
    "Unpaid Leave Days": sorted.reduce((s, p) => s + p.unpaidLeaveDays, 0),
    "Unpaid Deduction ($)": sorted.reduce(
      (s, p) => s + p.unpaidLeaveDeduction,
      0,
    ),
    "Tax 10% ($)": sorted.reduce((s, p) => s + p.tax, 0),
    "Net Salary ($)": sorted.reduce((s, p) => s + p.netSalary, 0),
    Status: `${sorted.filter((p) => p.status === "PAID").length}/${sorted.length} PAID`,
  };

  const ws = XLSX.utils.json_to_sheet([...rows, summaryRow]);
  ws["!cols"] = [
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  const sheetName = employeeName.slice(0, 31); // Excel sheet name max 31 chars
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const safeName = employeeName.replace(/\s+/g, "_");
  downloadFile(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Payslips_${safeName}.xlsx`,
  );
}

// ─── EMPLOYEE: Export single-month payslip as PDF ────────────────────────────

export function exportEmployeePayslipToPdf(
  record: PayrollRecord,
  employeeName: string,
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const gross =
    record.baseSalary + record.overtimePay - record.unpaidLeaveDeduction;
  const dailyRate = (record.baseSalary / 160) * 8;
  const hourlyRate = record.baseSalary / 160;

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("PAYSLIP", 14, 16);

  doc.setFontSize(10);
  doc.text("HR Payroll Management System", 14, 24);
  doc.text(`Pay Period: ${record.month}`, 14, 31);

  // Status badge (right side)
  const badgeColor =
    record.status === "PAID" ? [5, 150, 105] : [217, 119, 6];
  doc.setFillColor(...(badgeColor as [number, number, number]));
  doc.roundedRect(160, 12, 36, 10, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(record.status, 178, 18.5, { align: "center" });

  // ── Employee info ─────────────────────────────────────────────────────────
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Employee Information", 14, 52);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const infoLeft = [
    ["Employee Name", employeeName],
    ["Employee ID", String(record.employeeId)],
    ["Pay Period", record.month],
  ];

  infoLeft.forEach(([label, value], i) => {
    doc.text(label, 14, 60 + i * 7);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(value, 60, 60 + i * 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
  });

  const infoRight = [
    ["Hourly Rate", usd(hourlyRate)],
    ["Daily Rate", usd(dailyRate)],
    ["Generated", new Date().toLocaleDateString("en-US")],
  ];

  infoRight.forEach(([label, value], i) => {
    doc.text(label, 115, 60 + i * 7);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(value, 155, 60 + i * 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
  });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 83, 196, 83);

  // ── Salary breakdown table ────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Salary Breakdown", 14, 91);

  autoTable(doc, {
    startY: 95,
    head: [["Component", "Description", "Amount"]],
    body: [
      [
        "Base Salary",
        "160 hrs/month standard",
        usd(record.baseSalary),
      ],
      [
        "Overtime Pay",
        record.overtimePay > 0
          ? `Hourly rate × overtime hours × 1.5`
          : "No overtime",
        record.overtimePay > 0 ? `+ ${usd(record.overtimePay)}` : "—",
      ],
      [
        "Unpaid Leave Deduction",
        record.unpaidLeaveDays > 0
          ? `${record.unpaidLeaveDays} day(s) × ${usd(dailyRate)}/day`
          : "No unpaid leave",
        record.unpaidLeaveDeduction > 0
          ? `- ${usd(record.unpaidLeaveDeduction)}`
          : "—",
      ],
      ["Gross Salary", "Base + Overtime − Unpaid Leave", usd(gross)],
      ["Income Tax", "10% of gross salary", `- ${usd(record.tax)}`],
    ],
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 90, textColor: [100, 116, 139] },
      2: { cellWidth: 46, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Net Salary box ────────────────────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFillColor(5, 150, 105); // emerald-600
  doc.roundedRect(14, finalY, 182, 18, 4, 4, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("NET SALARY", 20, finalY + 11);

  doc.setFontSize(16);
  doc.text(usd(record.netSalary), 192, finalY + 11, { align: "right" });

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This payslip is generated by HR Payroll Management System. For inquiries, contact HR.",
    105,
    285,
    { align: "center" },
  );

  const safeName = employeeName.replace(/\s+/g, "_");
  doc.save(`Payslip_${safeName}_${record.month}.pdf`);
}

// ─── ADMIN: Export all employees as Excel ────────────────────────────────────

export interface EmployeeRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
  isActive: boolean;
}

export function exportEmployeesToExcel(employees: EmployeeRecord[]) {
  const rows = employees.map((e) => ({
    ID: e.id,
    "First Name": e.firstName,
    "Last Name": e.lastName,
    Email: e.email || "—",
    Department: e.department || "—",
    Position: e.position || "—",
    "Base Salary ($)": e.baseSalary,
    "Hire Date": e.hireDate
      ? new Date(e.hireDate).toLocaleDateString("en-US")
      : "—",
    Status: e.isActive ? "Active" : "Inactive",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 14 },
    { wch: 28 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const date = new Intl.DateTimeFormat("en-CA").format(new Date());
  downloadFile(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Employees_${date}.xlsx`,
  );
}

// ─── ADMIN: Export all employees as PDF ──────────────────────────────────────

export function exportEmployeesToPdf(employees: EmployeeRecord[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const active = employees.filter((e) => e.isActive).length;
  const inactive = employees.length - active;

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, 297, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("HR Payroll Management System", 14, 13);
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Employee Directory Report  ·  Generated: ${date}`, 14, 22);

  // Summary line
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total: ${employees.length}   |   Active: ${active}   |   Inactive: ${inactive}`,
    14,
    38,
  );

  // ── Table ─────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 43,
    head: [
      ["ID", "Name", "Email", "Department", "Position", "Base Salary", "Hire Date", "Status"],
    ],
    body: employees.map((e) => [
      String(e.id),
      `${e.firstName} ${e.lastName}`,
      e.email || "—",
      e.department || "—",
      e.position || "—",
      usd(e.baseSalary),
      e.hireDate
        ? new Date(e.hireDate).toLocaleDateString("en-US")
        : "—",
      e.isActive ? "Active" : "Inactive",
    ]),
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 12 },
      2: { cellWidth: 55 },
      5: { halign: "right", fontStyle: "bold" },
      7: { cellWidth: 18 },
    },
    didParseCell(data) {
      // Colour status col
      if (data.column.index === 7 && data.section === "body") {
        const val = data.cell.raw as string;
        data.cell.styles.textColor =
          val === "Active" ? [5, 150, 105] : [220, 38, 38];
        data.cell.styles.fontStyle = "bold";
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Confidential — HR Payroll Management System",
    148.5,
    doc.internal.pageSize.height - 8,
    { align: "center" },
  );

  const dateStr = new Intl.DateTimeFormat("en-CA").format(new Date());
  doc.save(`Employees_${dateStr}.pdf`);
}
