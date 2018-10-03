import React from 'react'
import PropTypes from 'prop-types'

import { Field } from 'redux-form'
import PrimaryButton from '../../buttons/PrimaryButton'

import style from './CustomNetworkForm.css'

const CustomNetworkForm = ({ renderTextField, errors, onSubmit }) => {
  return (
    <form onSubmit={ onSubmit } className={ style.customNetworkForm }>
      <Field component={ renderTextField } type='text' name='name' label='Network Name' error={ errors.name } />
      <Field component={ renderTextField } type='text' name='url' label='Network URL' error={ errors.url } />
      <PrimaryButton buttonText='Add Network' classNames={ style.customNetworkButton } />
    </form>
  )
}

CustomNetworkForm.propTypes = {
  renderTextField: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default CustomNetworkForm
