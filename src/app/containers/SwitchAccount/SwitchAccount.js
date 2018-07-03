import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'

import * as Neoscan from '../../utils/api/neoscan'

import SwitchAccountCard from '../../components/SwitchAccountCard'
import SwitchAccountConfirm from '../../components/SwitchAccountConfirm'
import Loader from '../../components/Loader'

import switchSVG from '../../../img/syncSolid.svg'

import style from './SwitchAccount.css'

class SwitchAccount extends Component {
  state = {
    accounts: [],
    showPasswordPrompt: false,
    loading: false,
    switchAccountError: '',
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
      const selected = account.address === address
      let selectedStyles = null
      let switchAccountButton = null

      if (selected) {
        selectedStyles = style.accountSelected
        selectedAccountIndex = index
      } else {
        switchAccountButton = (
          <button className={ style.switchAccountButton } onClick={ this.handleSwitchAccountCardClick }>
            <img src={ switchSVG } alt='arrows in circle' />Switch
          </button>
        )
      }

      return (
        <SwitchAccountCard
          label={ label }
          neo={ neo }
          gas={ gas }
          address={ address }
          encryptedKey={ encryptedKey }
          switchAccountButton={ switchAccountButton }
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
      .catch(() => {
        this.setState({
          loading: false,
          switchAccountError: 'We could not switch your account. Please make sure your password is correct.',
        })
      })
  }

  handleChange = e => this.setState({ password: e.target.value })

  handleErrorClose = e => this.setState({ switchAccountError: '' })

  resetAccountInfo = () => this.setState({ encryptedWif: '', showPasswordPrompt: false })

  render() {
    const { showPasswordPrompt, password, loading, switchAccountError } = this.state
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
              onErrorCloseHandler={ this.handleErrorClose }
              value={ password }
              error={ switchAccountError }
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
