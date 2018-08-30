import React from 'react'
import PropTypes from 'prop-types'

import DropDown from '../../DropDown'

import neonPNG from '../../../../img/icon-34.png'
import ellipsisSVG from '../../../../img/ellipsis-v.svg'

import style from './AccountInfoHeader.css'

const AccountInfoHeader = ({ showOptions, label, address, accountDropDownMarkup }) => {
  let accountDetailsClasses = showOptions ? style.accountInfo : style.accountInfoNoOptions

  return (
    <div className={ accountDetailsClasses }>
      <div className={ style.accountInfoImageContainer }>
        <img src={ neonPNG } alt='Neo' />
      </div>
      <div className={ style.accountInfoDetails }>
        <h2 className={ style.accountInfoDetailsHeading }>{label}</h2>
        <p className={ style.accountInfoDetailsParagraph }>{address}</p>
      </div>
      {showOptions && (
        <DropDown
          buttonContent={ <img src={ ellipsisSVG } alt='three vertical dots' className={ style.accountInfoDropdownButtonImage } /> }
          buttonStyles={ style.accountDropDownButton }
          dropDownContent={ accountDropDownMarkup }
          dropDownContentClassNames={ style.accountInfoDropDown }
        />
      )}
    </div>
  )
}

AccountInfoHeader.propTypes = {
  showOptions: PropTypes.bool,
  label: PropTypes.string,
  address: PropTypes.string,
  accountDropDownMarkup: PropTypes.element,
}

export default AccountInfoHeader
