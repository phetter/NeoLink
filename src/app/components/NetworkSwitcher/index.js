// NetworkSwitcher/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DropDown from '../DropDown'

import style from './NetworkSwitcher.css'

import chevron from '../../../img/chevron-down.svg'
import neoImg from '../../../img/icon-34.png'
import flask from '../../../img/flask.svg'

import * as Neoscan from '../../utils/api/neoscan'

import { truncateString } from '../../utils/api/neon'

import * as string from '../../utils/string'

class NetworkSwitcher extends Component {
  changeNetwork = selectedNetworkId => {
    const { setNetwork, setTransactions, account, setBalance } = this.props

    if (selectedNetworkId) {
      setNetwork(selectedNetworkId)
      // neon-js / neondb version follows
      //  getBalance(networks, selectedNetworkId, account).then(results => setBalance(results.neo, results.gas))
      //  getTransactions(networks, selectedNetworkId, account).then(results => setTransactions(results))

      if (Neoscan.switchNetwork(selectedNetworkId)) {
        console.log('switching to : ' + selectedNetworkId)
        Neoscan.getBalance(account.address).then(results => {
          console.log('results', results)
          if (results) setBalance(results.neo, results.gas)
        })
        // Neoscan.getTxsByAddress(account.address).then(results => setTransactions(results))

        let page = 1

        Neoscan.get_address_abstracts(account.address, page)
          .then(results => {
            if (results && results.data) {
              let totalPages = results.data.total_pages
              let pageSize = results.data.page_size
              let pageNumber = results.data.page_number
              let totalTxs = results.data.total_entries
              let txs = {}
              txs.address = account.address
              txs.data = []
              txs.total = totalTxs
              txs.viewing = 'Viewing ' + pageSize + ' of ' + totalTxs + ' transactions on Page ' + pageNumber + ' of ' + totalPages

              if (results.data && results.data.entries) {
                setTransactions({})
                return results.data.entries.map(tx => {
                  return Neoscan.get_transaction(tx.txid).then(txDetail => {
                    txDetail.stringRemarks = []

                    txDetail.attributes.map((remark, i) => {
                      if (remark.usage === 'Remark') {
                        let s = string.hexstring2str(remark.data)
                        txDetail.stringRemarks.push(s)
                      }
                    })

                    txDetail.txTime = new Date(txDetail.time * 1000).toLocaleString()
                    txs.data.push(txDetail)
                    setTransactions(txs)
                  })
                })
              }
            }
          })
      } else { // most likely a custom network, other than MainNet or TestNet, was passed— currently unhandled by neoscanapi.js
        // TODO add error handling and recovery
      }
    }
  }

  getIndicator = (networks, index) => {
    let indicator
    const networkName = networks[index].name

    if (networkName === 'MainNet') {
      indicator = <img src={ neoImg } alt='neo' className={ style.mainNetNeoImg } />
    } else if (networkName === 'TestNet') {
      indicator = <img src={ flask } alt='flask' className={ style.networkOptionIcon } />
    } else {
      indicator = (
        <div
          style={ {
            height: '13px',
            width: '15px',
            marginRight: '8px',
            borderRadius: '3px',
            backgroundColor: '#f15c5c',
          } }
        />
      )
    }

    return indicator
  }

  generateNetworkOptions() {
    const networkOptions = []
    const { selectedNetworkId, networks } = this.props

    Object.keys(networks).forEach(index => {
      const indicator = this.getIndicator(networks, index)

      const selected = selectedNetworkId === index

      networkOptions.push(
        <button
          key={ `option-key-${index}` }
          className={ style.networkOptionButton }
          onClick={ () => this.changeNetwork(index) }
        >
          {indicator}
          {truncateString(networks[index].name, 12)}
          {selected && <div className={ style.networkNavigationOptionSelected } />}
        </button>
      )
    })
    return networkOptions
  }

  render() {
    const networkOptions = this.generateNetworkOptions()
    const { selectedNetworkId } = this.props

    const buttonContent = (
      <div className={ style.networkNavigationButtonContent }>
        {truncateString(selectedNetworkId, 9)}
        <img src={ chevron } className={ style.networkNavigationChevron } alt='chevron down' />
      </div>
    )

    return (
      <section className={ style.networkNavigation }>
        <DropDown
          buttonContent={ buttonContent }
          buttonStyles={ style.networkNavigationButton }
          classNames={ style.networkNavigationButtonContainer }
          dropDownContent={ networkOptions }
          dropDownContentClassNames={ style.networkNavigationDropDownContainer }
        />
      </section>
    )
  }
}

NetworkSwitcher.propTypes = {
  selectedNetworkId: PropTypes.string,
  setTransactions: PropTypes.func,
  setNetwork: PropTypes.func,
  setBalance: PropTypes.func,
  account: PropTypes.object,
  networks: PropTypes.object,
}

export default NetworkSwitcher
