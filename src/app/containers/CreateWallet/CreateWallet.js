import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'

import PrimaryButton from '../../components/common/buttons/PrimaryButton'
import InputField from '../../components/common/form/InputField'
import Box from '../../components/common/Box'
import CreateWalletSucessPage from '../../components/successPages/CreateWalletSuccessPage'

import { labelExists } from '../../utils/helpers'

import style from './CreateWallet.css'
import Loader from '../../components/Loader'

class CreateWallet extends Component {
  state = {
    loading: false,
    encryptedWif: '',
    passPhrase: '',
    passPhraseConfirm: '',
    label: '',
    address: '',
    wif: '',
  }

  _handleTextFieldChange = e => {
    const { clearFormFieldError } = this.props
    const key = e.target.id

    clearFormFieldError(key)
    this.setState({
      [key]: e.target.value,
    })
  }

  _validateLabel = () => {
    const { label } = this.state
    const { accounts, setFormFieldError, validateLength } = this.props
    const labelDeclared = labelExists(label, accounts)

    if (!validateLength(label, 1)) {
      setFormFieldError('label', 'Account name must be longer than 1.')
      return false
    } else if (labelDeclared) {
      setFormFieldError('label', 'You already have an account with that label')
      return false
    } else {
      setFormFieldError('label', '')
      return true
    }
  }

  _validatePassPhrase = () => {
    const { passPhrase } = this.state
    const { setFormFieldError, validateLength } = this.props

    if (!validateLength(passPhrase, 10)) {
      setFormFieldError('passPhrase', 'Passphrase must be longer than 10 characters.')
      return false
    } else {
      setFormFieldError('passPhrase', '')
      return true
    }
  }

  _validatePasswordMatch = () => {
    const { passPhrase, passPhraseConfirm } = this.state
    const { setFormFieldError } = this.props

    if (!passPhrase || !passPhraseConfirm || passPhrase !== passPhraseConfirm) {
      setFormFieldError('passPhraseConfirm', 'Passphrases do not match.')
      return false
    } else {
      setFormFieldError('passPhraseConfirm', '')
      return true
    }
  }

  _validateWIF = () => {
    const { wif } = this.state
    const { manualWIF, setFormFieldError } = this.props

    if (manualWIF && !wallet.isWIF(wif)) {
      setFormFieldError('wif', 'Invalid WIF')
      return false
    } else {
      setFormFieldError('wif', '')
      return true
    }
  }

  _validate = () => {
    const labelValidated = this._validateLabel()
    const passPhraseValidated = this._validatePassPhrase()
    const passPhraseMatchValidated = this._validatePasswordMatch()
    const wifValidated = this._validateWIF()

    if (labelValidated && passPhraseValidated && passPhraseMatchValidated && wifValidated) {
      return true
    }
    return false
  }

  handleSubmit = event => {
    event.preventDefault()

    const { label, passPhrase, wif } = this.state
    const { addAccount, manualWIF, setAccount } = this.props

    const validated = this._validate()
    if (validated) {
      this.setState({ loading: true })

      const account = new wallet.Account(manualWIF ? wif : wallet.generatePrivateKey())

      wallet
        .encryptAsync(account.WIF, passPhrase)
        .then(encryptedWif => {
          const accountObject = {
            key: encryptedWif,
            address: account.address,
            label: label,
            isDefault: false,
          }

          addAccount(new wallet.Account(accountObject))

          this.setState(
            {
              loading: false,
              encryptedWif: encryptedWif,
              address: account.address,
            },
            () => setAccount(account.WIF, account.address)
          )
        })
        .catch(e => {
          this.setState({ loading: false, errorMsg: e.message })
        })
    }
  }

  render() {
    const { loading, passPhrase, passPhraseConfirm, wif, label, encryptedWif, address } = this.state
    const { manualWIF, history, errors } = this.props

    if (loading) {
      return <Loader />
    } else if (encryptedWif) {
      return <CreateWalletSucessPage encryptedWif={ encryptedWif } address={ address } history={ history } />
    }

    return (
      <section className={ style.createWalletWrapper }>
        <Box>
          <h1 className={ style.createWalletHeading }>Create Wallet</h1>
          <form onSubmit={ this.handleSubmit } className={ style.createWalletForm }>
            {manualWIF && (
              <InputField
                type='password'
                value={ wif }
                id='wif'
                onChangeHandler={ this._handleTextFieldChange }
                label='Wif'
                error={ errors && errors.wif }
              />
            )}
            <InputField
              type='input'
              value={ label }
              id='label'
              onChangeHandler={ this._handleTextFieldChange }
              label='Account Name'
              error={ errors && errors.label }
            />
            <InputField
              type='password'
              value={ passPhrase }
              id='passPhrase'
              onChangeHandler={ this._handleTextFieldChange }
              label='Password'
              error={ errors && errors.passPhrase }
            />
            <InputField
              type='password'
              value={ passPhraseConfirm }
              id='passPhraseConfirm'
              onChangeHandler={ this._handleTextFieldChange }
              label='Confirm Password'
              error={ errors && errors.passPhraseConfirm }
            />

            <PrimaryButton buttonText={ 'Create' } classNames={ style.createWalletButton } />
          </form>
        </Box>
      </section>
    )
  }
}

CreateWallet.propTypes = {
  addAccount: PropTypes.func.isRequired,
  setAccount: PropTypes.func.isRequired,
  manualWIF: PropTypes.bool,
  history: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  clearFormFieldError: PropTypes.func.isRequired,
  validateLength: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
}

export default CreateWallet
