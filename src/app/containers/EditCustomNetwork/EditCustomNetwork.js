import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import SettingsNavigation from '../../components/SettingsNavigation'
import InputField from '../../components/common/form/InputField'
import SelectBox from '../../components/common/form/SelectBox'
import NetworkSuccessPage from '../../components/successPages/NetworkSuccessPage'
import CustomNetworkForm from '../../components/common/form/CustomNetworkForm'
import CustomNetworkContainer from '../../components/CustomNetworkContainer'

import withForm from '../../components/HoC/withForm'

export class EditCustomNetwork extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: this.props.match.params.id,
      name: 'somename',
      url: '',
      apiType: 'neoscan',
      showSuccess: false,
    }
  }

  componentDidMount() {
    const { networks } = this.props
    const { id } = this.props.match.params

    const currentObjectName = Object.keys(networks).find(
      network => networks[network].name.toLowerCase() === id.toLowerCase()
    )

    const currentObject = networks[currentObjectName]

    this.props.initialize({ name: currentObject.name, url: currentObject.url, apiType: currentObject.apiType })
  }

  _validateName = input => {
    const { validateLength, setFormFieldError } = this.props

    if (!validateLength(input, 3)) {
      setFormFieldError('name', 'Name must be longer than 3 characters')
      return false
    }

    return true
  }

  _validateUrl = input => {
    const { validateLength, setFormFieldError } = this.props

    if (!validateLength(input, 10)) {
      setFormFieldError('url', 'Url must be longer than 3 characters')
      return false
    }
    return true
  }

  handleSubmit = (values, dispatch, formProps) => {
    const { reset } = formProps
    const { name, url, apiType } = values
    const { id } = this.state
    const { editCustomNetwork } = this.props

    const validatedName = this._validateName(name)
    const validatedUrl = this._validateUrl(url)

    if (validatedName && validatedUrl && apiType) {
      editCustomNetwork(name, url, apiType, id)
      this.setState({
        name: '',
        url: '',
        apiType: '',
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
          <NetworkSuccessPage history={ history } title={ 'Network Updated' } />
        ) : (
          <Fragment>
            <SettingsNavigation history={ history } path='/manageNetworks' />
            <CustomNetworkContainer title='Edit Network'>
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

EditCustomNetwork.propTypes = {
  editCustomNetwork: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  networks: PropTypes.object.isRequired,
  match: PropTypes.object,
  initialize: PropTypes.func,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validateLength: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
}

export default reduxForm({
  form: 'editCustomNetwork',
  destroyOnUnmount: false,
})(withForm(EditCustomNetwork))
