const axios = require('axios');

const scrape = (items) => {
  const result = []
  for (let item of items) {
    result.push({
      available: item?.supportedResultInfo?.availabilityInfo?.availability == "AVAILABILITY_AVAILABLE",
      sld: item?.domainName?.sld,
      tld: "." + item?.domainName?.tld,
      currency: (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.registerPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.renewPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.transferPrice?.currencyCode
      ) || (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.registerPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.renewPrice?.currencyCode ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.transferPrice?.currencyCode
      ) || "USD",
      price: (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.registerPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.renewPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.normalPricing?.transferPrice?.units
      ) || (
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.registerPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.renewPrice?.units ||
        item?.supportedResultInfo?.purchaseInfo?.pricing?.registryPremiumPricing?.transferPrice?.units
      ) || 0
    })
  }
  return result
}

module.exports = async function (opts) {
  const { tld, domain } = opts;
  const query = tld ? `${domain}.${tld}` : domain;
  const url = "https://domains.google.com/v1/Main/FeSearchService/Search"
  const website = "https://domains.google.com"
  const title = "Google Domains"

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
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      "clientFilters": {},
      "clientUserSpec": {
        "countryCode": "PH",
        "currencyCode": "USD"
      },
      "debugType": "DEBUG_TYPE_NONE",
      "query": query
    }),
    method: "POST",
    transformResponse: (res) => {
      // remove the first 4 characters, trim, and parse to JSON
      return JSON.parse(String(res).slice(4).trim());
    },
    responseType: 'json'
  })
    .then(e => {
      res.result = scrape(e.data?.searchResponse?.results?.result)
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