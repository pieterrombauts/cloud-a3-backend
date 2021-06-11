import {
  encode,
  decode,
  trim,
  isBase64,
  isUrlSafeBase64,
} from 'url-safe-base64'

export function urlBase64EncodeObj(object: Record<any, any>) {
  const jsonStr = JSON.stringify(object)
  const base64Str = Buffer.from(jsonStr).toString('base64')
  return encode(base64Str)
}

export function urlBase64DecodeObj(urlBase64Str: string) {
  const base64Str = decode(urlBase64Str)
  const jsonString = Buffer.from(base64Str, 'base64').toString()
  return JSON.parse(jsonString)
}
