import React from 'react'
import PropTypes from 'prop-types'

import Box from '../common/Box'

import style from './CustomNetworkContainer.css'

const CustomNetworkContainer = ({ children, title }) => {
  return (
    <section className={ style.customNetworkContainer }>
      <Box classNames={ style.customNetworkBox }>
        <h1 className={ style.customNetworkHeading }>{title}</h1>
        {children}
      </Box>
    </section>
  )
}

CustomNetworkContainer.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
}

export default CustomNetworkContainer
