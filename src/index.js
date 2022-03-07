import freenom from './vendor/freenom.js'
import parseQuery from './lib/parseQuery.js'

export const methods = {
  freenom,
}

export const vendors = Object.keys(methods)

const check = (query) => {
  const { domain, tld } = parseQuery(query);
  const res = {}
  for (let vendor of vendors) {
    res[ vendor ] = async () => await methods[ vendor ]({domain, tld})
  }
  return res
}

export default check