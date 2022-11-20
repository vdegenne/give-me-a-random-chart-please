import data from './sl-relations.json'

export function getcoinurl (coinname: string) {
  const result = data.find(p => p.s === coinname.toUpperCase())
  if (!result) {
    return null
  }

  return `https://coinmarketcap.com/currencies/${result.l}/`
}