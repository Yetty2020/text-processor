import { useState, useEffect } from "react"
import Detector from './Detector'
import {useSummarizer } from './Summarizer'
import { useTranslator } from './Translator'
import { BsFillSendFill } from "react-icons/bs";
import { IoLanguage } from "react-icons/io5";


const languageNames = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'tr': 'Turkish',
  'pl': 'Polish',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'sw': 'Swahili'
}

export default function Hero() {

    const [inputText, setInputText] = useState('')
    const [displayTexts, setDisplayTexts] = useState([])
    const [detector, setDetector] = useState(null)
    const { getSummary, error } = useSummarizer()
  const [isLoading, setIsLoading] = useState(false)
  const [summaries, setSummaries] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const { translate } = useTranslator()

    const handleSummarize = async (text, id) => {
    setIsLoading(true)
    const summary = await getSummary(text)
    setIsLoading(false)
    
    if (summary) {
      setSummaries({
        ...summaries,
        [id]: summary
      })
    }
  }

    //languageDetector API

    useEffect(() => {
    const initializeDetector = async () => {
      const languageDetectorCapabilities = await self.ai.languageDetector.capabilities()
      const canDetect = languageDetectorCapabilities.capabilities

      if (canDetect === 'readily') {
        const newDetector = await self.ai.languageDetector.create()
        setDetector(newDetector)
      } else if (canDetect !== 'no') {
        const newDetector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`)
            })
          },
        })
        await newDetector.ready
        setDetector(newDetector)
      }
    }

    initializeDetector()
  }, [])

  //Language Translator 
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter text to translate')
      return
    }

    const translatedText = await translate(inputText, selectedLanguage)
    if (translatedText) {
      setDisplayTexts([...displayTexts, {
        id: Date.now(),
        text: translatedText,
        language: selectedLanguage,
        isTranslation: true
      }])
    }
  }
  

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }
  const getLanguageName = (code) => {
    return languageNames[code] || code
  }

  const handleSubmit = async () => {
  if (!inputText.trim()) {
    setErrorMessage('This field is empty')
    return
  }

  if (detector) {
    setErrorMessage('')
    const results = await detector.detect(inputText)
    const detectedLanguage = getLanguageName(results[0].detectedLanguage)
    setDisplayTexts([...displayTexts, {
      text: inputText,
      language: detectedLanguage,
      needsSummary: inputText.length > 150
    }])
    setInputText('')
  }
}
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className=" flex flex-col  justify-center p-3 lg:p-4 lg:px-6   ">
    <header className="flex items-center justify-content flex-col pb-4 ">
    <div className="flex items-center gap">
    <IoLanguage className="text-xl"/>
        <h2 className="text-3xl font-bold text-center ">
            AI LANGUAGE DETECTOR, TRANSLATOR AND SUMMARIZER.
        </h2>
        </div>
        <p>How can we help you?</p>
    </header>
    <div className="mb-20  z-0 pb-40">
        {displayTexts.map((item, index) => (
          <div key={index} className="flex flex-col items-end">
            <Detector text={item.text} className="text-right self-end shadow-xl bg-grey" />
            <div className=" flex items-center gap-2 border border-blue max-w-fit p-3 rounded-lg self-start mb-4">
            <span><IoLanguage/></span>
              <span className="text-lg text-gray-600">
                Detected Language: {item.language}
              </span>
              </div>
              {item.needsSummary && (

                <div>
                
                <button 
          className={`p-3 text-lg self-end text-right ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded`}
          onClick={() => handleSummarize(item.text)}
          disabled={isLoading}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
        {summaries[item.id] && (
                <div className=" p-3 bg-gray-100 rounded self-start mt-3 mb-6">
                 
                  <p>{summaries[item.id]}</p>
                </div>
              )}

        </div>
       
              )}
            
          </div>
        ))}
      </div>

        <section className="flex flex-col-reverse fixed bottom-0 left-0 w-full z-10 bg-white pt-6 ">
        {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 text-center">
          {errorMessage}
        </div>
      )}
      <div className="w-full flex rounded-lg pl-4   border-t border-gray-300 focus:outline-none focus:border-blue-500 lg:h-30 h-15  ">
      <input 
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your text here"
        className=" w-full outline-none"
      />
       <button 
          onClick={handleSubmit}
          className="p-6 bg-blue-500 text-white hover:bg-blue-600 border-t border-blue-600 "
        ><BsFillSendFill/>
        
        </button>
        </div>


        <div className="w-full flex p-2 ">
    <select 
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="w-48 p-2 border rounded-lg mr-2"
    >
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="ru">Russian</option>
      <option value="tr">Turkish</option>
      <option value="fr">French</option>
      <option value="pt">Portuguese</option>
    </select>
    <button 
      onClick={handleTranslate}
      className="px-6 bg-green-500 text-white hover:bg-green-600 rounded-lg"
    >
      Translate
    </button>
  </div>
        </section>
      
    </div>
  )
}
