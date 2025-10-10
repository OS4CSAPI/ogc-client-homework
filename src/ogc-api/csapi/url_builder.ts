export function buildQueryUrl(baseHref: string, queryType: string, format = 'json'): string {
  return `${baseHref}/${queryType}?f=${format}`;
}
