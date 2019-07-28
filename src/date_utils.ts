// tslint:disable-next-line max-line-length
const VALID_ISO_DATE_REGEX = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

const TIME_ZONE = 'America/Mexico_City'

export function isValidDateString(dateString: string): boolean {
  return !!dateString.match(VALID_ISO_DATE_REGEX)
}

export function parseIsoDate(dateString: string): Date {
  if (!isValidDateString(dateString)) { throw new Error('invalid date string') }
  return new Date(dateString)
}

export function dateStringFromDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function humanDate(date: Date): string {
  const options = {
    timeZone: TIME_ZONE,
    month: 'short',
    day: 'numeric'
  }

  return date.toLocaleDateString('en-US', options)
}

export function humanTime(date: Date): string {
  const options = {
    timeZone: TIME_ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric'
  }

  return date.toLocaleString('en-US', options)
}
