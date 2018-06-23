import React from 'react'
import PropTypes from 'prop-types'

import AccountInfoHeader from '../../components/AccountInfo/AccountInfoHeader'
import AccountInfoAmounts from '../../components/AccountInfo/AccountInfoAmounts'

import style from './SwitchAccountCard.css'

const SwitchAccountCard = ({ address, neo, gas, label, classNames, encryptedKey, onClickHandler }) => {
  return (
    <section className={ style.switchAccountCard + ' ' + classNames } onClick={ onClickHandler }>
      <AccountInfoHeader address={ address } label={ label } showOptions={ false } />
      <AccountInfoAmounts neo={ neo } gas={ gas } showRefresh={ false } classNames={ style.switchAccountAmounts } />
    </section>
  )
}

SwitchAccountCard.propTypes = {
  address: PropTypes.string,
  neo: PropTypes.number,
  gas: PropTypes.number,
  label: PropTypes.string,
  classNames: PropTypes.string,
  encryptedKey: PropTypes.string,
  onClickHandler: PropTypes.func,
}

export default SwitchAccountCard
