import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import Box from '../../components/common/Box'
import SettingsNavigation from '../../components/SettingsNavigation'
import InputField from '../../components/common/form/InputField'
import SelectBox from '../../components/common/form/SelectBox'
import NetworkSuccessPage from '../../components/successPages/NetworkSuccessPage'
import CustomNetworkForm from '../../components/common/form/CustomNetworkForm'

import withForm from '../../components/HoC/withForm'

import style from './EditCustomNetwork.css'

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

  _renderSelectField = ({ input, ...rest }) => (
    <SelectBox { ...input } { ...rest } onChangeHandler={ event => input.onChange(event.target.value) } />
  )

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
    const { handleSubmit, history, errors } = this.props

    return (
      <Fragment>
        {showSuccess ? (
          <NetworkSuccessPage history={ history } title={ 'Network Updated' } />
        ) : (
          <section className={ style.addCustomNetwork }>
            <SettingsNavigation history={ history } path='/manageNetworks' />
            <section className={ style.addCustomNetworkContainer }>
              <Box classNames={ style.addCustomNetworkBox }>
                <h1 className={ style.addCustomNetworkHeading }>Edit Network</h1>
                <CustomNetworkForm
                  onSubmit={ handleSubmit(this.handleSubmit) }
                  renderTextField={ this._renderTextField }
                  renderSelectField={ this._renderSelectField }
                  errors={ errors }
                />
              </Box>
            </section>
          </section>
        )}
      </Fragment>
    )
  }
}

EditCustomNetwork.propTypes = {
  editCustomNetwork: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  networks: PropTypes.object.isRequired,
  match: PropTypes.object,
  initialize: PropTypes.func,
  clearFormFieldError: PropTypes.func.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validateLength: PropTypes.func.isRequired,
}

export default reduxForm({
  form: 'editCustomNetwork',
  destroyOnUnmount: false,
})(withForm(EditCustomNetwork))
