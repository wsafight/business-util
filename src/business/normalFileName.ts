export function normalizeFileName(fileName: string) {
  if (!fileName) return fileName
  fileName = fileName.replace(/[\\/|:*?"><]/g, '_')
  return fileName
}