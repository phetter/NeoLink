import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import BackNavigation from '../../components/BackNavigation'
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
      txUrl: '',
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

    // TODO fix this to work with composable system
    this.props.initialize({
      name: currentObject.name,
      url: currentObject.url,
      txUrl: currentObject.txUrl,
      apiType: currentObject.apiType,
    })
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
    const { name, url, txUrl, apiType } = values
    const { id } = this.state
    const { editCustomNetwork } = this.props

    const validatedName = this._validateName(name)
    const validatedUrl = this._validateUrl(url)
    const validatedTxUrl = this._validateUrl(txUrl)

    if (validatedName && validatedUrl && validatedTxUrl && apiType) {
      editCustomNetwork(name, url, txUrl, apiType, id)
      this.setState({
        name: '',
        url: '',
        txUrl: '',
        apiType: '',
        showSuccess: true,
      })
      reset()
    }
  }

  render() {
    const { showSuccess } = this.state
    const { handleSubmit, history, errors, renderTextField } = this.props

    return (
      <Fragment>
        {showSuccess ? (
          <NetworkSuccessPage history={ history } title={ 'Network Updated' } />
        ) : (
          <Fragment>
            <BackNavigation onClickHandler={ () => history.push('/manageNetworks') } />
            <CustomNetworkContainer title='Edit Network'>
              <CustomNetworkForm
                onSubmit={ handleSubmit(this.handleSubmit) }
                renderTextField={ renderTextField }
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
}

export default reduxForm({
  form: 'editCustomNetwork',
  destroyOnUnmount: false,
})(withForm(EditCustomNetwork))
