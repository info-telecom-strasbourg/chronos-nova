export interface SheetConfig {
  name: string;
  academicYear?: string;
  startRow?: number;
}

export interface ExcelImportResult {
  file: File;
  sheetsConfig: SheetConfig[];
}
