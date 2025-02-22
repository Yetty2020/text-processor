import { useState, useEffect } from 'react'

export const useTranslator = () => {
  const [translator, setTranslator] = useState(null)

  useEffect(() => {
    const initializeTranslator = async () => {
      const available = (await self.ai.translator.capabilities()).available

      if (available === 'readily') {
        const newTranslator = await self.ai.translator.create()
        setTranslator(newTranslator)
      } else if (available !== 'no') {
        const newTranslator = await self.ai.translator.create()
        newTranslator.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded: ${e.loaded}/${e.total}`)
        })
        await newTranslator.ready
        setTranslator(newTranslator)
      }
    }

    initializeTranslator()
  }, [])

  const translate = async (text, targetLanguage) => {
    if (!translator) return null
    try {
      const translation = await translator.translate(text, {
        from: 'auto',
        to: targetLanguage
      })
      return translation
    } catch (error) {
      console.error('Translation failed:', error)
      return null
    }
  }

  return { translate }
}
