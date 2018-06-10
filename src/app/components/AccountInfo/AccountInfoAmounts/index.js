import React from 'react'
import PropTypes from 'prop-types'

import neonPNG from '../../../../img/icon-34.png'

import syncSolidSVG from '../../../../img/syncSolid.svg'
import tintSVG from '../../../../img/tint.svg'

import style from './AccountInfoAmounts.css'

const AccountInfoAmounts = ({ neo, getBalance, gas, showRefresh = true, classNames }) => {
  return (
    <div className={ style.accountInfoAmounts + ' ' + classNames }>
      <div className={ style.accountInfoNeoAmount }>
        <img src={ neonPNG } alt='Neo' className={ style.accountInfoNeoAmountImg } />
        <p className={ style.accountInfoAmountParagraph }>{neo} NEO</p>
      </div>
      {showRefresh && (
        <button className={ style.accountInfoRefreshButton } onClick={ getBalance }>
          <img src={ syncSolidSVG } alt='refresh balance' className={ style.accountInfoRefreshButtonImage } />
        </button>
      )}
      <div className={ style.accountInfoGasAmount }>
        <img src={ tintSVG } alt='drop' className={ style.accountInfoGasAmountImage } />
        <p className={ style.accountInfoAmountParagraph }>{gas > 0 ? gas : 0} GAS</p>
      </div>
    </div>
  )
}

AccountInfoAmounts.propTypes = {
  neo: PropTypes.number.isRequired,
  gas: PropTypes.number.isRequired,
  getBalance: PropTypes.func,
  showRefresh: PropTypes.bool,
  classNames: PropTypes.string,
}

export default AccountInfoAmounts
