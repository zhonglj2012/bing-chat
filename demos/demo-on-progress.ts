import dotenv from 'dotenv-safe'

import { BingChat } from '../src'

dotenv.config()

/**
 * Demo CLI for testing the `onProgress` streaming support.
 *
 * ```
 * npx tsx demos/demo-on-progress.ts
 * ```
 */
async function main() {
  const api = new BingChat({ cookie: process.env.BING_COOKIE })

  const prompt = 'What is the distance to Mars?'

  console.log(prompt)
  const res = await api.sendMessage(prompt, {
    onProgress: (partialResponse) => {
      console.log(
        '------------------------------------------------------------'
      )
      console.log(partialResponse.text)
      let markdown = ''
      if (partialResponse.detail.sourceAttributions!) {
        let list = partialResponse.detail.sourceAttributions
        for (let i = 0; i < list.length; i++) {
          markdown += `[${list[i].providerDisplayName}](${list[i].seeMoreUrl}) `
        }
      }
      console.log(markdown)
      console.log(
        '------------------------------------------------------------'
      )
    }
  })
  let text = res.text
  const replacements = new Map()
  res.detail.sourceAttributions
    .map((obj) => obj.seeMoreUrl)
    .forEach((replacement, index) => {
      replacements.set((index + 1).toString(), replacement)
    })
  text = text.replace(/\[\^(.*?)\^\]/g, (match, placeholder) => {
    return `[${placeholder}](${replacements.get(placeholder)})` || match
  })
  console.log(text)
  // console.log(res.detail.sourceAttributions)
}
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
