export const ensurePrefix = (str: string, prefix: string) => {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}
