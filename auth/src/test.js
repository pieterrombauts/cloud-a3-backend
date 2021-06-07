const argon2 = require('argon2')

;(async () => {
  const hash = await argon2.hash(123456)

  console.log(await argon2.verify(hash, 123456))
})()
