import React from 'react'
import PropTypes from 'prop-types'

import InputField from '../../components/common/form/InputField'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'
import Box from '../../components/common/Box'
import BackNavigation from '../../components/BackNavigation'
import ErrorCard from '../../components/errors/ErrorCard'

import keySVG from '../../../img/key.svg'

import style from './SwitchAccountConfirm.css'

const SwitchAccountConfirm = ({
  onClickHandler,
  password,
  onChangeHandler,
  onSubmitHandler,
  error,
  onErrorCloseHandler,
}) => {
  return (
    <section>
      {console.log(error)}
      {error && <ErrorCard message={ error } onClickHandler={ onErrorCloseHandler } />}
      <BackNavigation onClickHandler={ onClickHandler } />
      <section className={ style.switchAccountConfirmContainer }>
        <Box classNames={ style.switchAccountBox }>
          <img src={ keySVG } alt='key' className={ style.switchAccountConfirmImage } />
          <h1>Confirm Ownership</h1>
          <p className={ style.switchAccountConfirmParagraph }>
            In order to confirm that this is your account, please type in the password for this account
          </p>
          <form className={ style.switchAccountConfirmForm }>
            <InputField
              type='password'
              value={ password }
              onChangeHandler={ onChangeHandler }
              placeholder={ 'Password' }
              classNames={ style.switchAccountInputField }
            />
            <PrimaryButton buttonText='Confirm Switch' onClickHandler={ onSubmitHandler } />
          </form>
        </Box>
      </section>
    </section>
  )
}

SwitchAccountConfirm.propTypes = {
  onClickHandler: PropTypes.func,
  onChangeHandler: PropTypes.func,
  onSubmitHandler: PropTypes.func,
  onErrorCloseHandler: PropTypes.func,
  password: PropTypes.string,
  error: PropTypes.string,
}

export default SwitchAccountConfirm
