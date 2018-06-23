import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'

import * as Neoscan from '../../utils/api/neoscan'

import SwitchAccountCard from '../../components/SwitchAccountCard'
import SwitchAccountConfirm from '../../components/SwitchAccountConfirm'
import Loader from '../../components/Loader'

import style from './SwitchAccount.css'

class SwitchAccount extends Component {
  state = {
    accounts: [],
    showPasswordPrompt: false,
    loading: false,
    password: '',
    encryptedWif: '',
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

  handleSwitchAccountCardClick = encryptedWif => {
    const { account } = this.props
    if (encryptedWif !== account.wif) {
      this.setState({ showPasswordPrompt: true, encryptedWif })
    }
  }

  handlePasswordSubmit = () => {
    const { encryptedWif, password } = this.state
    const { setAccount, history } = this.props
    this.setState({ loading: true })
    console.log(encryptedWif, password)
    wallet
      .decryptAsync(encryptedWif, password)
      .then(wif => {
        const account = new wallet.Account(wif)

        setAccount(encryptedWif, account.address)
        history.push('/home')
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  handleChange = e => this.setState({ password: e.target.value })

  resetAccountInfo = () => this.setState({ encryptedWif: '', showPasswordPrompt: false })

  render() {
    const { showPasswordPrompt, password, loading } = this.state
    return (
      <Fragment>
        {loading && <Loader />}
        {!showPasswordPrompt &&
          !loading && (
            <section className={ style.switchAccountContainer }>
              <h1 className={ style.switchAccountHeading }>Switch Account</h1>
              {this.generateAccountCards()}
            </section>
          )}
        {showPasswordPrompt &&
          !loading && (
            <SwitchAccountConfirm
              onClickHandler={ this.resetAccountInfo }
              onSubmitHandler={ this.handlePasswordSubmit }
              onChangeHandler={ this.handleChange }
              value={ password }
            />
          )}
      </Fragment>
    )
  }
}

SwitchAccount.propTypes = {
  accounts: PropTypes.object,
  account: PropTypes.object,
  selectedNetworkId: PropTypes.object,
  setAccount: PropTypes.func,
  history: PropTypes.object,
}

export default SwitchAccount
