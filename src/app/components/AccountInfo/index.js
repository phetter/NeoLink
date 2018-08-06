import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import AccountInfoHeader from './AccountInfoHeader'
import AccountInfoAmounts from './AccountInfoAmounts'
import AccountInfoError from './AccountInfoError'
import AccountInfoDropdownContent from './AccountInfoDropDownContent'

const AccountInfo = ({ label, onClickHandler, neo, gas, address, amountsError, getBalance, showOptions }) => {
  const accountDropDownMarkup = <AccountInfoDropdownContent onClickHandler={ onClickHandler } address={ address } />

  return (
    <Fragment>
      <AccountInfoHeader
        showOptions={ showOptions }
        address={ address }
        label={ label }
        accountDropDownMarkup={ accountDropDownMarkup }
      />
      {amountsError && <AccountInfoError getBalance={ getBalance } amountsError={ amountsError } />}
      {!amountsError && <AccountInfoAmounts neo={ neo } gas={ gas } getBalance={ getBalance } />}
    </Fragment>
  )
}

AccountInfo.propTypes = {
  label: PropTypes.string.isRequired,
  showOptions: PropTypes.bool,
  onClickHandler: PropTypes.func,
  getBalance: PropTypes.func,
  neo: PropTypes.number,
  gas: PropTypes.number,
  address: PropTypes.string.isRequired,
  amountsError: PropTypes.string,
}

export default AccountInfo
