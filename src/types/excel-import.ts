export interface SheetConfig {
  name: string;
  academicYear?: string;
}

export interface ExcelImportResult {
  file: File;
  sheetsConfig: SheetConfig[];
}
