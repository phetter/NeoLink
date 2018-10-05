import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'
import { Field, reduxForm } from 'redux-form'

import PrimaryButton from '../common/buttons/PrimaryButton'
import Box from '../common/Box'
import Loader from '../Loader'
import StartPage from '../StartPage'

import withForm from '../HoC/withForm'

import style from './Login.css'
import * as Neoscan from '../../utils/api/neoscan'

export class Login extends Component {
  state = {
    loading: false,
    encryptedWif: '',
    passPhrase: '',
  }

  handleSubmit = (values, dispatch, formProps) => {
    const { clearFormFieldError } = this.props
    const { reset } = formProps
    const encryptedWif = values.encryptedWif
    const passPhrase = values.passPhrase

    this.setState(
      {
        loading: true,
      },
      () => clearFormFieldError('passPhrase')
    )

    const {
      setAccount,
      selectedNetworkId,
      history,
      setBalance,
      setTransactions,
      setFormFieldError,
    } = this.props

    // console.log('encryptedWif: ' + encryptedWif)
    // console.log('werd: ' + passPhrase)

    wallet
      .decryptAsync(encryptedWif, passPhrase)
      .then(wif => {
        const account = new wallet.Account(wif)

        reset()
        // NOTE NEVER 'setAccount(wif' like was previously done
        setAccount(encryptedWif, account.address)
        this.setState({ loading: false })
        history.push('/home')

        // getBalance(networks, selectedNetworkId, account).then(results => {
        //   setBalance(results.neo, results.gas)
        // })
        // getTransactions(networks, selectedNetworkId, account).then(transactions => setTransactions(transactions))
        Neoscan.setNet(selectedNetworkId)
        Neoscan.getBalance(account.address).then(results => setBalance(results.neo, results.gas))
        Neoscan.getTxsByAddressUrl(account.address).then(results => setTransactions(results))
      })
      .catch(e => {
        this.setState({ loading: false }, () => setFormFieldError('passPhrase', 'Wrong password'))
      })
  }

  getAccountOptions(accounts) {
    const options = [{ label: 'Select Account', value: '' }]

    Object.keys(accounts).forEach(index => {
      const accountn = accounts[index]
      options.push({ label: accountn.label, value: accountn.key })
    })
    return options
  }

  render() {
    const { loading } = this.state
    const { accounts, account, handleSubmit, errors, renderSelectField, renderTextField } = this.props

    if (loading) {
      return <Loader />
    }
    if (account.wif !== '') {
      return null
    }

    if (Object.keys(accounts).length === 0) {
      return <StartPage />
    }

    return (
      <section className={ style.loginWrapper }>
        <Box>
          <h1 className={ style.loginHeading }>Login</h1>
          <form onSubmit={ handleSubmit(this.handleSubmit) } className={ style.loginForm }>
            <Field
              label='Account'
              component={ renderSelectField }
              cssOnly
              name='encryptedWif'
              options={ this.getAccountOptions(accounts) }
            />
            <Field
              component={ renderTextField }
              type='password'
              name='passPhrase'
              id='passPhrase'
              label='password'
              error={ errors.passPhrase }
            />
            <div>
              <PrimaryButton classNames={ style.loginButton } buttonText={ 'Login' } />
            </div>
          </form>
        </Box>
      </section>
    )
  }
}

Login.propTypes = {
  setAccount: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setTransactions: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object,
  clearFormFieldError: PropTypes.func.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  selectedNetworkId: PropTypes.string,
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(withForm(Login))
