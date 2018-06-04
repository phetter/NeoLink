import React from 'react'
import PropTypes from 'prop-types'

import exclamationSVG from '../../../img/exclamationGrey.svg'

import style from './FlashMessage.css'

const FlashMessage = ({ flashMessage, classNames }) => (
  <h5 className={ style.flashMessage + ' ' + classNames }>
    <img src={ exclamationSVG } alt='exclamation mark' className={ style.flashMessageImage } />
    {flashMessage}
  </h5>
)

FlashMessage.propTypes = {
  flashMessage: PropTypes.string.isRequired,
  classNames: PropTypes.string,
}

export default FlashMessage
