import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getBalance } from '../../utils/helpers'

import SwitchAccountCard from '../../components/SwitchAccountCard'

import style from './SwitchAccount.css'

class SwitchAccount extends Component {
  state = {
    accounts: [],
  }

  componentDidMount() {
    this.setInitialState()
  }

  setInitialState = () => {
    const { accounts, networks, selectedNetworkId } = this.props
    const formattedAccounts = []

    Object.keys(accounts).map(account => {
      return getBalance(networks, selectedNetworkId, accounts[account].address).then(response => {
        formattedAccounts.push({
          address: accounts[account].address,
          encryptedKey: accounts[account].key,
          label: accounts[account].label,
          neo: response.neo,
          gas: response.gas,
        })
      })
    })

    this.setState({ accounts: formattedAccounts })
  }

  generateAccountCards = () => {
    const { accounts } = this.state
    return accounts.map(({ label, neo, gas, address }) => (
      <SwitchAccountCard label={ label } neo={ neo } gas={ gas } address={ address } />
    ))
  }

  render() {
    const { accounts } = this.state

    return (
      <section className={ style.switchAccountContainer }>
        <h1 className={ style.switchAccountHeading }>Switch Account</h1>
        {accounts.length > 0 && this.generateAccountCards()}
      </section>
    )
  }
}

SwitchAccount.propTypes = {
  accounts: PropTypes.object,
  account: PropTypes.object,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.object,
}

export default SwitchAccount
