export interface SheetConfig {
  name: string;
  academicYear?: string;
  startRow?: number;
}

export interface ExcelImportResult {
  file: File;
  sheetsConfig: SheetConfig[];
}

export interface ExcelImportSummary {
  totalRowsRead: number;
  totalImported: number;
  totalBadlyImported: number;
  totalDuplicates: number;
}
