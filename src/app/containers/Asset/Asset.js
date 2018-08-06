import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './Asset.css'

class Asset extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    const { assetName, assetAmount } = this.props
    // this.icon = neoSent === true ? <img src={ neoPNG } alt='neo' /> : <i className='fas fa-tint' />
    this.amount = assetAmount
    this.name = assetName
  }

  render() {
    return (
      <div>
        <div />
        <div className={ style.assetCard }>
          <h4 className={ style.assetCardName }>{this.name}</h4>
          <h4 className={ style.assetCardAmount }>{this.amount}</h4>
        </div>
      </div>
    )
  }
}

Asset.propTypes = {
  assetName: PropTypes.string.isRequired,
  assetAmount: PropTypes.string.isRequired,
}

export default Asset
