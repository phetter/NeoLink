import React from 'react'

import SelectBox from '../common/form/SelectBox'
import InputField from '../common/form/InputField'

function withForm(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        errors: {},
      }
    }

    clearFormFieldError = key => {
      const { errors } = this.state
      if (errors[key]) this.setFormFieldError(key, '')
    }

    setFormFieldError = (key, value) => {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          [key]: value,
        },
      }))
    }

    validateLength = (input, minLength) => {
      if (!input || input.length < minLength) return false
      return true
    }

    renderTextField = ({ input, ...rest }) => (
      <InputField
        { ...input }
        { ...rest }
        onChangeHandler={ event => {
          input.onChange(event.target.value)
          this.clearFormFieldError(event.target.name)
        } }
      />
    )

    renderSelectField = ({ input, ...rest }) => (
      <SelectBox { ...input } { ...rest } onChangeHandler={ event => input.onChange(event.target.value) } />
    )

    render() {
      return (
        <WrappedComponent
          errors={ this.state.errors }
          setFormFieldError={ this.setFormFieldError }
          clearFormFieldError={ this.clearFormFieldError }
          validateLength={ this.validateLength }
          renderTextField={ this.renderTextField }
          renderSelectField={ this.renderSelectField }
          { ...this.props }
        />
      )
    }
  }
}

export default withForm
