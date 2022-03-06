const check = require('../src');

module.exports = async function(query, vendor) {

  await check(query)[ vendor ]()
    .then(e => {
      if (e.success) {
        console.log('vendor:', e.title)
        console.log('website:', e.website)
        console.log('result count:', e.result.length)
        console.table(e.result)
      } else throw e.message
    })
    .catch(e => {
      console.log(e.message)
    })
}