import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import TransactionRemarkForm from '../../components/common/form/TransactionRemarkForm'

import withForm from '../../components/HoC/withForm'

export class AddTransactionRemark extends Component {
  state = {
    name: '',
    url: '',
    apiType: 'neoscan',
    showSuccess: false,
  }

  handleSubmit = (values, dispatch, formProps) => {
    const { reset } = formProps
    const { transactionId, remark } = values
    const { addTransactionRemark } = this.props

    if (transactionId && remark) {
      addTransactionRemark(transactionId, remark)
      this.setState({
        transactionId: '',
        remark: '',
        showSuccess: true,
      })

      reset()
    }
  }

  render() {
    // const { transactionId, remark } = this.state
    const { handleSubmit, errors, renderTextField } = this.props

    return (
      <TransactionRemarkForm
        onSubmit={ handleSubmit(this.handleSubmit) }
        renderTextField={ renderTextField }
        errors={ errors }
      />
    )
  }
}

AddTransactionRemark.propTypes = {
  addTransactionRemark: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  // renderSelectField: PropTypes.func.isRequired,
  // transactionRemarks: PropTypes.object.isRequired,
}

export default reduxForm({
  form: 'addTransactionRemark',
  initialValues: { apiType: 'neoscan' },
  destroyOnUnmount: false,
})(withForm(AddTransactionRemark))
