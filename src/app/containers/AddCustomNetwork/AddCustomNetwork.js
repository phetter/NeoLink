import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import BackNavigation from '../../components/BackNavigation'
import NetworkSuccessPage from '../../components/successPages/NetworkSuccessPage'
import CustomNetworkForm from '../../components/common/form/CustomNetworkForm'
import CustomNetworkContainer from '../../components/CustomNetworkContainer'

import withForm from '../../components/HoC/withForm'

export class AddCustomNetwork extends Component {
  state = {
    name: '',
    url: '',
    apiType: 'neoscan',
    showSuccess: false,
  }

  _uniqueName = input => {
    const { networks } = this.props

    const filteredNetworks = Object.keys(networks).filter(
      networkName => networks[networkName].name.toLowerCase() === input.toLowerCase()
    )

    return filteredNetworks.length !== 0
  }

  _validateName = input => {
    const { setFormFieldError, validateLength } = this.props

    if (!validateLength(input, 3)) {
      setFormFieldError('name', 'Name must be longer than 3 characters')
      return false
    }

    if (this._uniqueName(input)) {
      setFormFieldError('name', 'Name must be unique')
      return false
    }

    return true
  }

  _validateUrl = input => {
    const { setFormFieldError, validateLength } = this.props

    if (!validateLength(input, 10)) {
      setFormFieldError('url', 'Url must be longer than 3 characters')
      return false
    }
    return true
  }

  handleSubmit = (values, dispatch, formProps) => {
    const { reset } = formProps
    const { name, url } = values
    const { addCustomNetwork } = this.props

    const validatedName = this._validateName(name)
    const validatedUrl = this._validateUrl(url)

    if (validatedName && validatedUrl) {
      addCustomNetwork(name, url, 'neoscan')

      this.setState({
        name: '',
        url: '',
        txUrl: '',
        apiType: 'neoscan',
        showSuccess: true,
      })
      reset()
    }
  }

  render() {
    const { showSuccess } = this.state
    const { handleSubmit, history, errors, renderTextField, renderSelectField } = this.props

    return (
      <Fragment>
        {showSuccess ? (
          <NetworkSuccessPage history={ history } title={ 'Network Added' } />
        ) : (
          <Fragment>
            <BackNavigation onClickHandler={ () => history.push('/settings') } />
            <CustomNetworkContainer title={ 'Add Network' }>
              <CustomNetworkForm
                onSubmit={ handleSubmit(this.handleSubmit) }
                renderTextField={ renderTextField }
                renderSelectField={ renderSelectField }
                errors={ errors }
              />
            </CustomNetworkContainer>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

AddCustomNetwork.propTypes = {
  addCustomNetwork: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  networks: PropTypes.object.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validateLength: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
}

export default reduxForm({
  form: 'addCustomerNetwork',
  initialValues: { apiType: 'neoscan' },
  destroyOnUnmount: false,
})(withForm(AddCustomNetwork))
