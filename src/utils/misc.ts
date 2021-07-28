import startCase from 'lodash.startcase'
import camelCase from 'lodash.camelcase'

/**
 * Title Case
 */

export const titleCase = (str: string) => startCase(camelCase(str))
