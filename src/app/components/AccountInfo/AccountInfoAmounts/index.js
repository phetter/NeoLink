import React from 'react'
import PropTypes from 'prop-types'

import neonPNG from '../../../../img/icon-34.png'

import style from './AccountInfoAmounts.css'

const AccountInfoAmounts = ({ neo, getBalance, gas }) => {
  return (
    <div className={ style.accountInfoAmounts }>
      <div className={ style.accountInfoNeoAmount }>
        <img src={ neonPNG } alt='Neo' className={ style.accountInfoNeoAmountImg } />
        <p className={ style.accountInfoAmountParagraph }>{neo} NEO</p>
      </div>
      <button className={ style.accountInfoRefreshButton } onClick={ getBalance }>
        <i className='fas fa-sync' />
      </button>
      <div className={ style.accountInfoGasAmount }>
        <i className='fas fa-tint' />
        <p className={ style.accountInfoAmountParagraph }>{gas > 0 ? gas : 0} GAS</p>
      </div>
    </div>
  )
}

AccountInfoAmounts.propTypes = {
  neo: PropTypes.number.isRequired,
  gas: PropTypes.number.isRequired,
  getBalance: PropTypes.func.isRequired,
}

export default AccountInfoAmounts
