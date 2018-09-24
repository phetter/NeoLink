import React from 'react'
import PropTypes from 'prop-types'

import exclamationTriangleSVG from '../../../../img/exclamation-triangle.svg'
import crossSVG from '../../../../img/times.svg'

import style from './ErrorCard.css'

const ErrorCard = ({ onClickHandler, message }) => (
  <div className={ style.errorCard + ' ' + classNames }>
    <img src={ exclamationTriangleSVG } alt='Exclamation triangle' className={ style.errorCardIcon } />
    <p className={ style.errorCardText }>{message}</p>
    <button className={ style.errorCardCloseButton } onClick={ onClickHandler }>
      <img src={ crossSVG } alt='cross' className={ style.errorCardExitButtonImage } />
    </button>
  </div>
)

ErrorCard.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
}

export default ErrorCard
