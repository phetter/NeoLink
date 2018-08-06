import React from 'react'
import PropTypes from 'prop-types'

import SettingsButton from '../../components/SettingsButton'

import uploadSVG from '../../../img/upload.svg'
import downloadSVG from '../../../img/downloadWhite.svg'
import plusSVG from '../../../img/plus-circle.svg'
import cogsSVG from '../../../img/cogs.svg'

import style from './Settings.css'

const Settings = props => (
  <section className={ style.settings }>
    <div className={ style.settingsContainer }>
      <h1 className={ style.settingsHeader }>Settings</h1>
      <div className={ style.settingsButtonContainer }>
        <SettingsButton
          icon={ <img src={ uploadSVG } alt='arrow up' className={ style.settingsIcon } /> }
          text='Import Wallet'
          onClickHandler={ () => props.history.push('/importWallet') }
        />
        <SettingsButton
          icon={ <img src={ downloadSVG } alt='arrow down' className={ style.settingsIcon } /> }
          text='Export Wallet'
          onClickHandler={ () => props.history.push('/exportWallet') }
        />
        <SettingsButton
          icon={ <img src={ plusSVG } alt='plus' className={ style.settingsIcon } /> }
          text='Add Network'
          onClickHandler={ () => props.history.push('/addCustomNetwork') }
        />
        <SettingsButton
          icon={ <img src={ cogsSVG } alt='three cogs' className={ style.settingsIcon } /> }
          text='Manage Networks'
          onClickHandler={ () => props.history.push('/manageNetworks') }
        />
      </div>
    </div>
  </section>
)

Settings.propTypes = {
  history: PropTypes.object,
}

export default Settings
