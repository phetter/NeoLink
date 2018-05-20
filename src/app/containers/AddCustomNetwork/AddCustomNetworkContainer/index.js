import React from 'react'
import PropTypes from 'prop-types'

import Box from '../../../components/common/Box'

import style from './AddCustomNetworkContainer.css'

const AddCustomNetworkContainer = ({ children }) => {
  return (
    <section className={ style.addCustomNetworkContainer }>
      <Box classNames={ style.addCustomNetworkBox }>
        <h1 className={ style.addCustomNetworkHeading }>Add Network</h1>
        {children}
      </Box>
    </section>
  )
}

AddCustomNetworkContainer.propTypes = {
  children: PropTypes.node,
}

export default AddCustomNetworkContainer
