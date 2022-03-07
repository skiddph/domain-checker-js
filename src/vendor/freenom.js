import axios from 'axios';

const scrape = (tlds) => {
  const result = []
  for (let tld of tlds) {
    result.push({
      available: !(tld.status == "NOT AVAILABLE" || tld.status === null) ? true : false,
      sld: tld.domain,
      tld: tld.tld,
      currency: tld.currency,
      price: Number(tld.price_int + "." + tld.price_cent) || 0,
    })
  }
  return result
}

export default async function (opts) {
  const { tld, domain } = opts;
  const url = "https://my.freenom.com/includes/domains/fn-available.php"
  const website = "https://www.freenom.com"
  const title = "Freenom"

  // RESPONSE FORMAT
  const res = {
    success: false,
    error: false,
    message: "",
    website,
    title,
    result: [],
  }

  return await axios({
    url,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: `domain=${domain}${tld ? '&tld=' + tld : ''}`,
    method: "POST"
  })
    .then(e => {
      let tlds = []; if (e.data?.top_domain && !e.data?.top_domain.dont_show) tlds.push(e.data.top_domain);
      res.result = scrape([ ...tlds, ...e.data?.free_domains, ...e.data?.paid_domains ])
      res.success = true;
      res.error = false;
      res.message = "Successfully checked domain availability."
      return res
    })
    .catch(() => {
      res.success = false;
      res.error = true;
      res.message = "Error checking domain availability."
      res.result = []
      return res
    })
}