import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'
import { Field, reduxForm } from 'redux-form'
import { getBalance, getTransactions } from '../../utils/helpers'

import SelectBox from '../common/form/SelectBox'
import InputField from '../common/form/InputField'
import PrimaryButton from '../common/buttons/PrimaryButton'
import Box from '../common/Box'
import Loader from '../Loader'
import StartPage from '../StartPage'

import withForm from '../HoC/withForm'

import style from './Login.css'

export class Login extends Component {
  state = {
    loading: false,
    encryptedWif: '',
    passPhrase: '',
  }

  _renderTextField = ({ input, ...rest }) => {
    const { clearFormFieldError } = this.props

    return (
      <InputField
        { ...input }
        { ...rest }
        onChangeHandler={ event => {
          input.onChange(event.target.value)
          clearFormFieldError(event.target.name)
        } }
      />
    )
  }

  _renderSelectField = ({ input, ...rest }) => (
    <SelectBox { ...input } { ...rest } onChangeHandler={ event => input.onChange(event.target.value) } />
  )

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
      history,
      selectedNetworkId,
      networks,
      setBalance,
      setTransactions,
      setFormFieldError,
    } = this.props

    wallet
      .decryptAsync(encryptedWif, passPhrase)
      .then(wif => {
        const account = new wallet.Account(wif)

        reset()
        setAccount(wif, account.address)
        this.setState({ loading: false })
        history.push('/home')

        getBalance(networks, selectedNetworkId, account).then(results => {
          setBalance(results.neo, results.gas)
        })
        getTransactions(networks, selectedNetworkId, account).then(transactions => setTransactions(transactions))
      })

      .catch(e => {
        this.setState({ loading: false }, () => setFormFieldError('passPhrase', 'Wrong password'))
      })
  }

  getAccountOptions(accounts) {
    const options = [{ label: 'Select Account', value: '' }]

    Object.keys(accounts).forEach(index => {
      const account = accounts[index]
      options.push({ label: account.label, value: account.key })
    })

    return options
  }

  render() {
    const { loading } = this.state
    const { accounts, account, handleSubmit, errors } = this.props

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
              component={ this._renderSelectField }
              cssOnly
              name='encryptedWif'
              options={ this.getAccountOptions(accounts) }
            />
            <Field
              component={ this._renderTextField }
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
  reset: PropTypes.func.isRequired,
  history: PropTypes.object,
  selectedNetworkId: PropTypes.string,
  networks: PropTypes.object,
  clearFormFieldError: PropTypes.func.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(withForm(Login))
