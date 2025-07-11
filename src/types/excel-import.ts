export interface SheetConfig {
  name: string;
  startRow: number;
}

export interface ExcelImportResult {
  file: File;
  sheetsConfig: SheetConfig[];
}
