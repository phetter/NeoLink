import React from 'react'
import PropTypes from 'prop-types'

import { Field } from 'redux-form'
import SecondaryButton from '../../buttons/SecondaryButton'

import style from './TransactionRemarkForm.css'

const TransactionRemarkForm = ({ renderTextField, errors, onSubmit }) => {
  return (

    <form onSubmit={ onSubmit } className={ style.transactionRemarkForm }>
      {/* <Field component={ renderTextField } value='test' hidden name='transactionId' label='id' error={ errors.transactionId } /> */}
      <Field component={ renderTextField } type='text' name='remark' label='Remarks' error={ errors.remark } />

      <SecondaryButton buttonText='Add Remark' classNames={ style.transactionRemarkButton } />
    </form>
  )
}

TransactionRemarkForm.propTypes = {
  renderTextField: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default TransactionRemarkForm
