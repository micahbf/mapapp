import { isValidDateString } from '../date_utils'

export function validateFromTo(queryParams: void | {[name: string]: string}): string[] {
  const errors = []

  if (!queryParams) {
    errors.push('Must provide a "from" param with a valid ISO date')
    return errors
  }

  if (!queryParams.from || !isValidDateString(queryParams.from)) {
    errors.push('Must provide a "from" param with a valid ISO date')
  }

  if (queryParams.to && !isValidDateString(queryParams.to)) {
    errors.push('Param "to" must be a valid ISO date if provided')
  }

  return errors
}
