import React from 'react'
import PropTypes from 'prop-types'

import arrowLeftSVG from '../../../img/arrow-left.svg'

import style from './BackNavigation.css'

const BackNavigation = ({ onClickHandler }) => (
  <section className={ style.backNavigation }>
    <button className={ style.backNavigationButton } onClick={ onClickHandler }>
      <img src={ arrowLeftSVG } alt='arrow left' className={ style.backNavigationButtonImage } />Back
    </button>
  </section>
)

BackNavigation.propTypes = {
  onClickHandler: PropTypes.func,
}

export default BackNavigation
