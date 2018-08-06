import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import BackNavigation from '../../components/BackNavigation'
import CustomNetworkCard from '../../components/CustomNetworkCard'
import Overlay from '../../components/Overlay'
import ConfirmDelete from '../../components/ConfirmDelete'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'

import trashSVG from '../../../img/trash.svg'
import editSVG from '../../../img/edit.svg'

import style from './CustomNetworkList.css'

// import { truncateUrl } from '../../utils/api/neon'

class CustomNetworkList extends Component {
  state = {
    showConfirmDelete: false,
    currentItem: {},
  }

  delete = index => {
    const { deleteCustomNetwork, setNetwork, selectedNetworkId } = this.props

    // If this is the current network they're using, reset to MainNet
    if (selectedNetworkId === index) {
      setNetwork('MainNet')
    }

    deleteCustomNetwork(index)
  }

  _generateDropDownContent = (index, name) => (
    <ul className={ style.customNetworkDropdown }>
      <li>
        <button
          className={ style.customNetworkDropDownButton }
          onClick={ () => {
            this.showConfirmDelete()
            this.setCurrentItem(index, name)
          } }
        >
          <img src={ trashSVG } alt='trashcan' className={ style.customNetworkDropDownButtonImage } /> Delete
        </button>
        <Link to={ `/editCustomNetwork/${name}` } className={ style.customNetworkLink }>
          <img src={ editSVG } alt='pen on paper' className={ style.customNetworkDropDownButtonImage } />Edit
        </Link>
      </li>
    </ul>
  )

  showConfirmDelete = () => this.setState({ showConfirmDelete: true })

  setCurrentItem = (index, name) => {
    const currentItem = { name, index }
    this.setState({ currentItem })
  }

  handleDelete = index => {
    this.delete(index)
    this.setState({ showConfirmDelete: false })
  }

  generateNetworkRows(networks) {
    const networkRows = []
    Object.keys(networks).forEach(index => {
      const network = networks[index]

      if (network.canDelete) {
        networkRows.push(
          <CustomNetworkCard
            name={ network.name }
            url={ network.url }
            key={ network.name }
            dropDownContent={ this._generateDropDownContent(index, network.name) }
          />
        )
      }
    })

    return networkRows
  }

  render() {
    const { showConfirmDelete, currentItem } = this.state
    const { networks, history } = this.props

    const networkRows = this.generateNetworkRows(networks)

    const content = networkRows.length ? (
      <Fragment>{networkRows}</Fragment>
    ) : (
      <div className={ style.customNetworkNoNetworksBox }>
        <h4>You have no custom networks.</h4>
        <PrimaryButton buttonText={ 'Add Network' } onClickHandler={ () => history.push('/addCustomNetwork') } />
      </div>
    )

    return (
      <div>
        {showConfirmDelete && (
          <Overlay>
            <ConfirmDelete
              onClickAcceptHandler={ () => this.handleDelete(currentItem.index) }
              onClickRejectHandler={ () => this.setState({ showConfirmDelete: false }) }
              item={ currentItem.name }
            />
          </Overlay>
        )}
        <BackNavigation onClickHandler={ () => history.push('/settings') } />
        <section className={ style.manageNetworksContainer }>
          <h1 className={ style.manageNetworksHeading }>Manage Networks</h1>
          {content}
        </section>
      </div>
    )
  }
}

CustomNetworkList.propTypes = {
  networks: PropTypes.object.isRequired,
  deleteCustomNetwork: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  selectedNetworkId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default CustomNetworkList
