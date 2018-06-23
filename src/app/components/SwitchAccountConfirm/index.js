import React from 'react'
import PropTypes from 'prop-types'

import InputField from '../../components/common/form/InputField'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'
import Box from '../../components/common/Box'
import SettingsNavigation from '../../components/SettingsNavigation'

import keySVG from '../../../img/key.svg'

import style from './SwitchAccountConfirm.css'

const SwitchAccountConfirm = ({ history }) => {
  return (
    <section>
      <SettingsNavigation path='/switchAccounts' history={ history } />
      <section className={ style.switchAccountConfirmContainer }>
        <Box classNames={ style.switchAccountBox }>
          <img src={ keySVG } alt='key' className={ style.switchAccountConfirmImage } />
          <h1>Confirm Ownership</h1>
          <p className={ style.switchAccountConfirmParagraph }>
            In order to confirm that this is your account, please type in the password for this account
          </p>
          <InputField
            type='password'
            onChange={ () => {} }
            placeholder={ 'Password' }
            classNames={ style.switchAccountInputField }
          />
          <PrimaryButton buttonText='Confirm Switch' />
        </Box>
      </section>
    </section>
  )
}

SwitchAccountConfirm.propTypes = {
  history: PropTypes.object,
}

export default SwitchAccountConfirm
