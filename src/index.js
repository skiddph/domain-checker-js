module.exports = (query) => {
  const { domain, tld } = require('./lib/parseQuery')(query);

  return {
    'freenom': async () => await require('./vendor/freenom')({ domain, tld }),
    'google': async () => await require('./vendor/google')({ domain, tld }),
  }
}