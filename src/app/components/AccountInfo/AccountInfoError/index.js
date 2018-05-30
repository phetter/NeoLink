import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import FlashMessage from '../../FlashMessage'
import PrimaryButton from '../../common/buttons/PrimaryButton'

import style from './AccountInfoError.css'

const AccountInfoError = ({ amountsError, getBalance }) => {
  return (
    <Fragment>
      <FlashMessage flashMessage={ amountsError } />
      <PrimaryButton buttonText='Retry' classNames={ style.accountInfoErrorButton } onClickHandler={ getBalance } />
    </Fragment>
  )
}

AccountInfoError.propTypes = {
  amountsError: PropTypes.string.isRequired,
  getBalance: PropTypes.func.isRequired,
}

export default AccountInfoError
