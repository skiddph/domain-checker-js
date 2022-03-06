# domain-checker-js

### Install

```bash
npm install @skiddph/domain-checker
```

### Example
```js
const domainChecker = require('@skiddph/domain-checker')

const query = 'domain.com' // format: 'domain.com' or 'domain'
const vendor = 'google' // Google Domains

await domainChecker(query)[vendor]()
  .then(e => {
    if(e.success) {
      console.log('vendor:', e.title)
      console.log('website:', e.website)
      console.log('result count:', e.result.length)
      console.table(e.result)  
    } else throw e.message
  })
  .catch(e => {
    console.log(e.message)
  })
```

### Response
```yaml
success: Boolean
error: Boolean
message: String
title: String
website: Sting
result: # Array
  - available: Boolean
    sld: String
    tld: String
    currency: String
    price: Number
```

### Available vendors
```txt
+----------+----------------+
| Key      | Name           |
+----------+----------------+
| google   | Google Domains |
| freenom  | Freenom        |
+----------+----------------+
```

### LICENSE
[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)[@skiddph](https://github.com/skiddph)