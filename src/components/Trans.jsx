import { useEffect } from 'react'

export default function Trans() {

    useEffect(() => {
        const checkTranslator = async () => {
          // Check capabilities first
          const capabilities = await self.ai.translator.capabilities()
          console.log('Translator capabilities:', capabilities)
    
          if (capabilities.available) {
            const translator = await self.ai.translator.create({
              sourceLanguage: 'es',
              targetLanguage: 'fr',
              monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                  console.log(`Download progress: ${e.loaded}/${e.total}`)
                })
              }
            })
            
            // Test with simple text
            const testText = "Hola mundo"
            const result = await translator.translate(testText)
            console.log('Translation test:', result)
          }
        }
    
        checkTranslator()
      }, [])
    
  return (
    <div>
      
    </div>
  )
}
