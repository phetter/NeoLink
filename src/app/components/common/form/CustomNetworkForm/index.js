import React from 'react'
import PropTypes from 'prop-types'

import { Field } from 'redux-form'
import PrimaryButton from '../../buttons/PrimaryButton'

import style from './CustomNetworkForm.css'

const CustomNetworkForm = ({ renderTextField, renderSelectField, errors, onSubmit }) => {
  return (
    <form onSubmit={ onSubmit } className={ style.customNetworkForm }>
      <Field component={ renderTextField } type='text' name='name' label='Network Name' error={ errors.name } />
      <Field component={ renderTextField } type='text' name='url' label='Network URL' error={ errors.url } />
      <Field
        label='API Type'
        component={ renderSelectField }
        name='apiType'
        options={ [
          {
            label: 'neoscan',
            value: 'neoscan',
          },
          {
            label: 'neonDB',
            value: 'neonDB',
          },
        ] }
      />
      <PrimaryButton buttonText='Add Network' classNames={ style.addCustomNetworkButton } />
    </form>
  )
}

CustomNetworkForm.propTypes = {
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default CustomNetworkForm
