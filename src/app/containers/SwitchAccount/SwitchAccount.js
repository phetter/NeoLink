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
    this.setAccountState()
  }

  componentWillReceiveProps(nextProps) {
    const { selectedNetworkId } = this.props
    if (selectedNetworkId !== nextProps.selectedNetworkId) {
      this.setAccountState()
    }
  }

  setAccountState = () => {
    const { accounts, networks, selectedNetworkId } = this.props
    const formattedAccounts = []

    const accountsArray = Object.keys(accounts)

    accountsArray.map((account, index) => {
      getBalance(networks, selectedNetworkId, accounts[account].address).then(response => {
        formattedAccounts.push({
          address: accounts[account].address,
          encryptedKey: accounts[account].key,
          label: accounts[account].label,
          neo: response.neo,
          gas: response.gas,
        })
        if (index === accountsArray.length - 1) {
          this.setState({ accounts: formattedAccounts })
        }
      })
    })
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
    return (
      <section className={ style.switchAccountContainer }>
        <h1 className={ style.switchAccountHeading }>Switch Account</h1>
        {this.generateAccountCards()}
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
