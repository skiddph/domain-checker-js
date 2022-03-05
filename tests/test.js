const check = require('../src');

module.exports = async function(query, vendor) {

  await check(query)[ vendor ]()
    .then(e => {
      if (e.success) {
        console.log('vendor:', e.title)
        console.log('website:', e.website)
        console.log('result count:', e.result.length)
        for (let item of e.result) {
          const { available, sld, tld, currency, price } = item
          if (available) {
            console.log(`${sld + tld} is available at ${currency} ${price}`)
          } else {
            console.log(`${sld + tld} is not available`)
          }
        }
      } else throw e.message
    })
    .catch(e => {
      console.log(e.message)
    })
}