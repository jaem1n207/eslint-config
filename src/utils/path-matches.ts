import path from 'node:path'

import picomatch from 'picomatch'

export function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join('/')
}

export function pathMatchesAny(filePath: string, patterns: string[]): boolean {
  const normalized = normalizePath(filePath)

  return patterns.some((pattern) => picomatch(pattern)(normalized))
}
