export function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function isPascalCase(value: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(value)
}

export function isUseCamelCase(value: string): boolean {
  return /^use[A-Z][A-Za-z0-9]*$/.test(value)
}

export function stripKnownExtensions(fileName: string): string {
  return fileName.replace(/\.(test|spec)?\.?(d\.)?(m|c)?(ts|tsx|js|jsx)$/u, '')
}
