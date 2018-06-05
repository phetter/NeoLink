import React from 'react'
import PropTypes from 'prop-types'

import DropDown from '../DropDown'

import ellpisisSVG from '../../../img/ellipsis-v.svg'

import style from './CustomNetworkCard.css'

const CustomNetworkCard = ({ name, url, dropDownContent }) => (
  <section className={ style.customNetworkCard }>
    <div className={ style.customNetworkColorContainer }>
      <div className={ style.customNetworkColor } />
    </div>
    <div className={ style.customNetworkContainer }>
      <h3>{name}</h3>
      <h3 className={ style.customNetworkUrl }>{url}</h3>
    </div>
    <DropDown
      buttonContent={ <img src={ ellpisisSVG } alt='three vertical dots' className={ style.customNetworkCardDropdownImage } /> }
      buttonStyles={ style.customNetworkDropdownButton }
      dropDownContent={ dropDownContent }
      classNames={ style.customNetworkDropDown }
    />
  </section>
)

CustomNetworkCard.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  dropDownContent: PropTypes.object.isRequired,
}

export default CustomNetworkCard
