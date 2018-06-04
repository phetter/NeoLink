import React from 'react'
import PropTypes from 'prop-types'

import arrowLeftSVG from '../../../img/arrow-left.svg'

import style from './SettingsNavigation.css'

const SettingsNavigation = ({ history, path = '/settings' }) => (
  <section className={ style.settingsNavigation }>
    <button className={ style.settingsNavigationButton } onClick={ () => history.push(path) }>
      <img src={ arrowLeftSVG } alt='arrow left' className={ style.settingsNavigationButtonImage } />Back
    </button>
  </section>
)

SettingsNavigation.propTypes = {
  history: PropTypes.object.isRequired,
  path: PropTypes.string,
}

export default SettingsNavigation
