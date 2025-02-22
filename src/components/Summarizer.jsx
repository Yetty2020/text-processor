import { useState, useEffect } from 'react'

const options = {
  sharedContext: 'This is a text input',
  type: 'key-points',
  format: 'markdown',
  length: 'medium',
}

export const useSummarizer = () => {
  const [summarizer, setSummarizer] = useState(null)
  const [error, setError] = useState(null)
 

  useEffect(() => {
    const initializeSummarizer = async () => {
      try {
        const available = (await self.ai.summarizer.capabilities()).available

        if (available === 'readily') {
          const newSummarizer = await self.ai.summarizer.create(options)
          setSummarizer(newSummarizer)
        } else if (available !== 'no') {
          const newSummarizer = await self.ai.summarizer.create(options)
          newSummarizer.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded: ${e.loaded}/${e.total}`)
          })
          await newSummarizer.ready
          setSummarizer(newSummarizer)
        } else {
          setError('Summarizer API is not available')
        }
      } catch (err) {
        setError(`Failed to initialize summarizer: ${err.message}`)
      }
    }

    initializeSummarizer()
  }, [])

  const getSummary = async (text) => {
    try {
      if (!summarizer) {
        throw new Error('Summarizer not initialized')
      }
      return await summarizer.summarize(text)
    } catch (err) {
      setError(`Summarization failed: ${err.message}`)
      return null
    }
  }

  return { getSummary, error }
}