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
      getBalance(networks, selectedNetworkId, accounts[account].address).then(response => {
        formattedAccounts.push({
          address: accounts[account].address,
          encryptedKey: accounts[account].key,
          label: accounts[account].label,
          neo: response.neo,
          gas: response.gas,
        })
      })
    })

    setTimeout(() => this.setState({ accounts: formattedAccounts }), 0)
  }

  generateAccountCards = () => {
    const { account } = this.props
    const { accounts } = this.state
    return accounts.map(({ label, neo, gas, address }) => {
      const selectedStyles = account.address === address ? style.accountSelected : null
      return (
        <SwitchAccountCard
          label={ label }
          neo={ neo }
          gas={ gas }
          address={ address }
          classNames={ selectedStyles }
          key={ address }
        />
      )
    })
  }

  render() {
    const { accounts } = this.state
    console.log(accounts)
    return (
      <section className={ style.switchAccountContainer }>
        <h1 className={ style.switchAccountHeading }>Switch Account</h1>
        {accounts && this.generateAccountCards()}
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
