import PropTypes from 'prop-types'

export default function Detector({text}) {
    
  return (
<div className="border border-blue text-left max-w-fit p-3 rounded-lg">
      
      <p>{text}</p>
    </div>
  )
}
Detector.propTypes = {
    text: PropTypes.string.isRequired
  }