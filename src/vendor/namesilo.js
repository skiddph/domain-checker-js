import axios from 'axios'
import parseQuery from '../lib/parseQuery.js'
const stlds = [ "com", "xyz", "top", "net", "org", "cc", "club", "buzz", "in", "info", "co", "icu", "me", "live", "us" ]

const scrape = (domains) => {
  const result = []
  for (let domain of domains) {
    const { domain: sld, tld } = parseQuery(domain.domain)
    result.push({
      available: domain.available,
      sld,
      tld: "." + tld,
      currency: 'USD',
      price: Number(domain.regularPrice || domain.renewalPrice || domain.currentPrice) || 0,
    })
  }
  return result
}

const pipe = [
  async ({ domain, tld, cors }) => {
    if (tld) {
      tld = tld.toLowerCase();
      if (stlds.indexOf(tld) === -1) stlds.push(tld);
    }
    const domains = []
    for (let tl of stlds) domains.push(`${domain}.${tl}`)
    return await axios({
      url: (cors || "") + "https://www.namesilo.com/public/api/domains/bulk-check",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: { domains, tlds: stlds }
    })
      .then(e => {
        console.log(e.data)
        return ({ ...e?.data?.data, cors })
      })
  },
  async ({ checkId, cors }) => {
    return await axios({
      url: (cors || "") + "https://www.namesilo.com/public/api/domains/results/" + checkId,
      method: "GET"
    })
      .then(e => {
        if (e?.data?.data?.domains) {
          return e?.data?.data?.domains
        } else throw new Error("Error checking domain availability.")
      })
  }
]

export default async function (opts) {
  const { tld, domain, cors } = opts;
  const website = "https://www.namesilo.com/"
  const title = "NameSilo"

  // RESPONSE FORMAT
  const res = {
    success: false,
    error: false,
    message: "",
    website,
    title,
    result: [],
  }

  return await pipe[ 0 ]({ domain, tld, cors })
    .then(async (e) => await pipe[ 1 ](e))
    .then((e) => {
      res.success = true;
      res.result = scrape(e);
      return res;
    })
    .catch(e => {
      res.success = false;
      res.error = true;
      res.message = e.message
      res.result = []
      return res
    })
}