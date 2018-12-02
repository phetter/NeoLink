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
    // this.icon = neoSent === true ? <img src={ neoPNG } alt='neo' /> : <i className='fas fa-tint' />
  }

  render() {
    const { assetName, assetAmount } = this.props
    return (
      <div>
        <div className={ style.assetCard }>
          <h4 className={ style.assetCardName }>{assetName}: {assetAmount}</h4>
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
