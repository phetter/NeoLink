import React from 'react'
import PropTypes from 'prop-types'

import checkSVG from '../../../../img/checkGreen.svg'

import style from './SuccessPage.css'

const SuccessPage = ({ title, children, classNames }) => (
  <section className={ style.successPage + ' ' + classNames }>
    <div className={ style.successPageIconContainer }>
      <img src={ checkSVG } alt='checkmark' className={ style.successPageIconImage } />
    </div>
    <h2 className={ style.successPageHeading }>{title}</h2>
    {children}
  </section>
)

SuccessPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  classNames: PropTypes.string,
}

export default SuccessPage
