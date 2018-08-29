import React from 'react'
import PropTypes from 'prop-types'

import checkSVG from '../../../../img/checkGreen.svg'

import style from './FailPage.css'

const FailPage = ({ title, children, classNames }) => (
  <section className={ style.FailPage + ' ' + classNames }>
    <div className={ style.FailPageIconContainer }>
      <img src={ checkSVG } alt='checkmark' className={ style.FailPageIconImage } />
    </div>
    <h2 className={ style.FailPageHeading }>{title}</h2>
    {children}
  </section>
)

FailPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  classNames: PropTypes.string,
}

export default FailPage
