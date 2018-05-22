import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { wallet } from '@cityofzion/neon-js'
import { labelExists } from '../../utils/helpers'

import Box from '../../components/common/Box'
import InputField from '../../components/common/form/InputField'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'
import Loader from '../../components/Loader'

import withForm from '../../components/HoC/withForm'

import style from './CreateWalletWithWif.css'

export class CreateWalletWithEncryptedWif extends Component {
  state = {
    loading: false,
    encryptedWif: '',
    passPhrase: '',
    address: '',
    label: '',
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

  _handleTextFieldChange = e => {
    const { clearFormFieldError } = this.props
    const key = e.target.id

    clearFormFieldError(key)
    this.setState({
      [key]: e.target.value,
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    const { encryptedWif, passPhrase, label } = this.state
    const { setAccount, addAccount, history, setFormFieldError } = this.props

    const validated = this._validateLabel(label)

    if (validated) {
      this.setState({ loading: true })
      wallet
        .decryptAsync(encryptedWif, passPhrase)
        .then(wif => {
          const account = new wallet.Account(wif)

          const accountObject = {
            key: encryptedWif,
            address: account.address,
            label: label,
            isDefault: false,
          }

          this.setState({ address: account.address, encryptedWif: wif, loading: false }, () => {
            addAccount(new wallet.Account(accountObject))
            setAccount(encryptedWif, account.address)
            history.push('/home')
          })
        })
        .catch(() => {
          this.setState({ loading: false })
          setFormFieldError('passPhrase', 'Wrong password or encrypted key')
        })
    }
  }

  render() {
    const { encryptedWif, passPhrase, label, loading } = this.state
    const { errors } = this.props

    const content = loading ? (
      <Loader />
    ) : (
      <section className={ style.createWalletWithWifWrapper }>
        <Box>
          <h1 className={ style.createWalletWithWifHeading }>Create wallet with encrypted key</h1>
          <form className={ style.createWalletWithWifForm } onSubmit={ this.handleSubmit }>
            <InputField
              type='input'
              value={ label }
              id='label'
              onChangeHandler={ this._handleTextFieldChange }
              label='Account Name'
              error={ errors.label }
            />
            <InputField
              type='password'
              value={ encryptedWif }
              id='encryptedWif'
              onChangeHandler={ this._handleTextFieldChange }
              label='Encrypted key'
              error={ '' }
            />
            <InputField
              type='password'
              value={ passPhrase }
              id='passPhrase'
              onChangeHandler={ this._handleTextFieldChange }
              label='Password'
              error={ errors.passPhrase }
            />
            <PrimaryButton buttonText={ 'Create' } classNames={ style.createWalletWithWifButton } />
          </form>
        </Box>
      </section>
    )

    return content
  }
}

CreateWalletWithEncryptedWif.propTypes = {
  addAccount: PropTypes.func.isRequired,
  setAccount: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  clearFormFieldError: PropTypes.func.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  validateLength: PropTypes.func.isRequired,
  errors: PropTypes.object,
}

export default withForm(CreateWalletWithEncryptedWif)
