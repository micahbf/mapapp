// tslint:disable-next-line max-line-length
const VALID_ISO_DATE_REGEX = /[+-]?\d{4}(?:-[01]\d(?:-[0-3]\d(?:T[0-2]\d:[0-5]\d:?(?:[0-5]\d(?:\.\d+)?)?(?:[+-][0-2]\d:[0-5]\d)?Z?)?)?)?/

export function isValidDateString(dateString: string): boolean {
  return !!dateString.match(VALID_ISO_DATE_REGEX)
}

export function parseIsoDate(dateString: string): Date {
  if (!isValidDateString(dateString)) { throw new Error('invalid date string') }
  return new Date(dateString)
}
