import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import * as Neoscan from '../../utils/api/neoscan'

import SwitchAccountCard from '../../components/SwitchAccountCard'

import style from './SwitchAccount.css'

class SwitchAccount extends Component {
  state = {
    accounts: [],
    showPasswordPrompt: false,
    encryptedKey: '',
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
    const { accounts } = this.props
    const formattedAccounts = []

    const accountsArray = Object.keys(accounts)
    console.log(accountsArray.length)
    accountsArray.map((account, index) => {
      Neoscan.getBalance(accounts[account].address).then(response => {
        formattedAccounts.push({
          address: accounts[account].address,
          encryptedKey: accounts[account].key,
          label: accounts[account].label,
          neo: response.neo,
          gas: response.gas,
        })
        if (index === accountsArray.length - 1) {
          setTimeout(() => this.setState({ accounts: formattedAccounts }), 0)
        }
      })
    })
  }

  generateAccountCards = () => {
    const { account } = this.props
    const { accounts } = this.state
    let selectedAccountIndex
    const accountCards = accounts.map(({ label, neo, gas, address, encryptedKey }, index) => {
      let selectedStyles = null
      if (account.address === address) {
        selectedStyles = style.accountSelected
        selectedAccountIndex = index
      }
      return (
        <SwitchAccountCard
          label={ label }
          neo={ neo }
          gas={ gas }
          address={ address }
          encryptedKey={ encryptedKey }
          classNames={ selectedStyles }
          onClickHandler={ () => this.handleSwitchAccountCardClick(encryptedKey) }
          key={ address }
        />
      )
    })
    const selectedAccount = accountCards.splice(selectedAccountIndex, 1)
    accountCards.unshift(selectedAccount)
    return accountCards
  }

  handleSwitchAccountCardClick = encryptedKey => {
    const { account } = this.props
    if (encryptedKey !== account.wif) {
      this.setState({ showPasswordPrompt: true, encryptedKey })
    }
  }

  render() {
    const { showPasswordPrompt } = this.state
    return (
      <section className={ style.switchAccountContainer }>
        {!showPasswordPrompt && (
          <Fragment>
            <h1 className={ style.switchAccountHeading }>Switch Account</h1>
            {this.generateAccountCards()}
          </Fragment>
        )}
        {showPasswordPrompt && <div>Password</div>}
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
