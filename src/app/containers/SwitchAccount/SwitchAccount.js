import React from 'react'
import PropTypes from 'prop-types'

const SwitchAccount = ({ accounts }) => {
  console.log(accounts)
  return <h1>Hello</h1>
}

SwitchAccount.propTypes = {
  accounts: PropTypes.object,
}

export default SwitchAccount
