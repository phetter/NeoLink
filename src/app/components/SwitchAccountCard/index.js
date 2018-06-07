import React from 'react'
import PropTypes from 'prop-types'

import AccountInfoHeader from '../../components/AccountInfo/AccountInfoHeader'

import style from './SwitchAccountCard.css'

const SwitchAccountCard = ({ address, neo, gas, label, classNames }) => {
  return (
    <section className={ style.switchAccountCard + ' ' + classNames }>
      <AccountInfoHeader address={ address } label={ label } showOptions={ false } />
    </section>
  )
}

SwitchAccountCard.propTypes = {
  address: PropTypes.string,
  neo: PropTypes.number,
  gas: PropTypes.number,
  label: PropTypes.string,
  classNames: PropTypes.string,
}

export default SwitchAccountCard
