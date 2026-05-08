import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";
import { MAJOR_MAPPINGS, OPTION_MAPPINGS, ORG_TYPE_ALIASES } from "./constants";

function parseDate(value: string | null): string | null {
  if (!value?.trim()) return null;
  let s = value.trim();
  if (s.includes(" - ")) s = (s.split(" - ")[0] ?? s).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(s)) {
    const parts = s.split(/[/-]/);
    const d = parseInt(parts[0] ?? "0", 10);
    const m = parseInt(parts[1] ?? "0", 10);
    const y = parseInt(parts[2] ?? "0", 10);
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function extractWeeks(s: string): number | null {
  const m = s.match(/\d+/);
  if (!m) return null;
  const n = parseInt(m[0] ?? "0", 10);
  return n > 0 ? n : null;
}

function formatCity(s: string): string {
  const low = new Set([
    "de",
    "du",
    "des",
    "d",
    "la",
    "le",
    "les",
    "l",
    "au",
    "aux",
    "à",
    "en",
    "et",
    "sur",
    "sous",
  ]);
  return s
    .trim()
    .toLowerCase()
    .split(/(\s+|-+)/)
    .map((p, i) => {
      if (/^(\s+|-+)$/.test(p)) return p;
      if (i === 0 || !low.has(p)) return p.charAt(0).toUpperCase() + p.slice(1);
      return p;
    })
    .join("");
}

function parseMajor(s: string): string | null {
  return MAJOR_MAPPINGS[s.toLowerCase().trim()] ?? null;
}

function parseOption(s: string): string | null {
  return OPTION_MAPPINGS[s.toLowerCase().trim()] ?? null;
}

function parseOrgType(s: string): "company" | "not_company" | null {
  return ORG_TYPE_ALIASES[s.toLowerCase().trim()] ?? null;
}

export interface SheetConfig {
  name: string;
  academicYear: string;
  startRow?: number;
}

export async function parseExcelBuffer(
  buffer: ArrayBuffer,
  sheets: SheetConfig[],
): Promise<InternshipFormData[]> {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const results: InternshipFormData[] = [];

  for (const { name, academicYear, startRow = 2 } of sheets) {
    const ws = workbook.getWorksheet(name);
    if (!ws) continue;

    ws.eachRow({ includeEmpty: false }, (row, rowNum) => {
      if (rowNum < startRow) return;

      const cell = (n: number) => {
        const c = row.getCell(n);
        return c?.text?.trim() ?? "";
      };

      const orgName = cell(5) || null;
      const orgTypeRaw = cell(6);
      const countryRaw = cell(7);
      const cityRaw = cell(8);
      const subjectRaw = cell(13);
      const dateRaw = cell(16);
      const weeksRaw = cell(17);
      const majorRaw = cell(3);
      const optionRaw = cell(4);

      if (!orgName && !subjectRaw && !dateRaw) return;

      results.push({
        subject: subjectRaw || null,
        beginDate: parseDate(dateRaw),
        endDate: null,
        weeksCount: extractWeeks(weeksRaw),
        major: parseMajor(majorRaw),
        option: parseOption(optionRaw),
        academicYear: ["1A", "2A", "3A"].includes(academicYear)
          ? (academicYear as "1A" | "2A" | "3A")
          : null,
        organizationName: orgName,
        organizationType: parseOrgType(orgTypeRaw),
        country: countryRaw || null,
        city: cityRaw ? formatCity(cityRaw) : null,
      });
    });
  }

  return results;
}
