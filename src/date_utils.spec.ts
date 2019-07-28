import {
  dateStringFromDate,
  humanDate,
  humanTime,
  isValidDateString
} from './date_utils'

describe('dateStringFromDate', () => {
  it('returns the date portion of a date in ISO format', () => {
    const input = new Date('1995-12-17T03:24:00Z')
    expect(dateStringFromDate(input)).toEqual('1995-12-17')
  })
})

describe('humanDate', () => {
  it('returns a short, human readable date in Central time', () => {
    const input = new Date('1995-12-17T03:24:00Z')
    expect(humanDate(input)).toEqual('Dec 16')
  })
})

describe('humanTime', () => {
  it('returns a short, human readable time in Central time', () => {
    const input = new Date('1995-12-17T03:24:00Z')
    expect(humanTime(input)).toEqual('Sat, Dec 16, 9:24 PM')
  })
})

describe('isValidDateString', () => {
  it('returns true for just a date', () => {
    expect(isValidDateString('2019-07-10')).toEqual(true)
  })

  it('returns true for a date with no time zone', () => {
    expect(isValidDateString('2019-07-10T12:00:00')).toEqual(true)
  })

  it('returns true for a date with Z time zone', () => {
    expect(isValidDateString('2019-07-10T12:00:00Z')).toEqual(true)
  })

  it('returns true for a date with an offset time zone', () => {
    expect(isValidDateString('2019-07-10T12:00:00+05:00')).toEqual(true)
  })

  it('returns true for a date with milliseconds', () => {
    expect(isValidDateString('2019-07-10T12:00:00.123Z')).toEqual(true)
  })

  it('returns false for invalid dates', () => {
    expect(isValidDateString('January 19, 1988')).toEqual(false)
  })
})
