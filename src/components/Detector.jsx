import PropTypes from 'prop-types'

export default function Detector({text}) {
    
  return (
<div className="border border-blue text-left max-w-fit p-3 rounded-lg mb-5">
      
      <p>{text}</p>
    </div>
  )
}
Detector.propTypes = {
    text: PropTypes.string.isRequired
  }