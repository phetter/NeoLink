import React from 'react'

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

    render() {
      const { errors } = this.state

      return (
        <WrappedComponent
          errors={ errors }
          setFormFieldError={ this.setFormFieldError }
          clearFormFieldError={ this.clearFormFieldError }
          validateLength={ this.validateLength }
          { ...this.props }
        />
      )
    }
  }
}

export default withForm
