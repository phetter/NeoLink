import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from '../../components/common/form/InputField'
import Select from '../../components/common/form/SelectBox'
import Button from '../../components/common/buttons/PrimaryButton'

import { callInvoke } from '../../utils/api/neon'

import style from './SendInvoke.css'

import withLoginCheck from '../../components/Login/withLoginCheck'

import { logDeep } from '../../utils/debug'

class SendInvoke extends Component {
  state = {
    loading: false,
    errorMsg: '',
    txid: '',
    args: [''],
    assetType: 'GAS',
    assetAmount: '0.00025',
  }

  _handleInputChange = e => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })
    logDeep('key: ', key + ' ' + e.target.value)
  }

  _handleArgChange = (id, e) => {
    var myArgs = this.state.args
    myArgs[id] = e.target.value

    this.setState({ args: myArgs })
    logDeep('args: ', myArgs);
  }

  _handleAddArgument = e => {
    e.preventDefault()
    this.setState({ args: this.state.args.concat(['']) })
  }

  _handleRemoveArg = (id, e) => {
    e.preventDefault()
    this.setState({ args: this.state.args.filter((s, idx) => id !== idx) })
  }

  _handleSubmit = event => {
    event.preventDefault()
    const { selectedNetworkId, networks, account } = this.props
    const { scriptHash, operation, args } = this.state

    this.setState({
      loading: true,
      errorMsg: '',
      txid: '',
    })

    if (!scriptHash || !operation || !assetAmount) {
      this.setState({
        loading: false,
        errorMsg: 'Error! Script hash, operation and amount are all required!',
      })

      return
    }

    callInvoke(networks[selectedNetworkId].url, account, this.state)
      .then(c => {
        if (c.response.result === true) {
          this.setState({
            loading: false,
            txid: c.response.txid,
          })
        } else {
          this.setState({
            loading: false,
            errorMsg: 'Invoke failed',
          })
        }
      })
      .catch(e => {
        this.setState({
          loading: false,
          errorMsg: 'Invoke failed',
        })
      })
  }

  render() {
    const { loading, txid, errorMsg } = this.state

    return (
      <React.Fragment>
        <form style={ { paddingTop: '35px' } } className={ style.formWrapper }>
          <Input
            type='text'
            placeholder='Script Hash'
            defaultValue={ this.state.scriptHash }
            id='scriptHash'
            onChangeHandler={ this._handleInputChange }
          />
          <Input
            type='text'
            placeholder='Operation'
            defaultValue={ this.state.operation }
            id='operation'
            onChangeHandler={ this._handleInputChange }
          />

          <div className={ style.argsWrapper }>
            {this.state.args.map((arg, idx) => (
              <div
                key={ `Invoke-Args-${idx + 1}` }
                className={ style.innerArgsWrapper }
              >
                <Input
                  style={ { flexGrow: 1, order: 1 } }
                  type='text'
                  placeholder={ `Argument #${idx + 1}` }
                  defaultValue={ arg }
                  id={ `Argument #${idx + 1} name` }
                  onChangeHandler={ (event) => this._handleArgChange(idx, event) }
                />
                <Button
                  style={ { flexGrow: 0, order: 0 } }
                  buttonText={ '-' }
                  onClickHandler={ (event) => this._handleRemoveArg(idx, event) } />
              </div>
            ))}
          </div>
          <Input
            type='text'
            placeholder='Amount'
            value={ this.state.assetAmount }
            id='assetAmount'
            onChangeHandler={ this._handleInputChange }
          />
          <Select
            cssOnly
            label='Asset'
            value={ this.state.assetType }
            onChangeHandler={ e => {
              console.log('asset: '+e.target.value)
              this.setState({
                assetType: e.target.value,
              })
            } }
            options={ [
              {
                label: 'NEO',
                value: 'NEO',
              },
              {
                label: 'GAS',
                value: 'GAS',
              },
            ] }
          />
          <div className={ style.btnWrapper }>
            <Button
              classNames={ style.btn }
              style={ { marginRight: '2px' } }
              onClickHandler={ this._handleAddArgument }
              buttonText={ 'Add Argument' } />

            <Button
              onClickHandler={ this._handleSubmit }
              buttonText={ 'Invoke' } />
          </div>
        </form>

        {txid && (
          <div className={ style.statusBox }>
            Success! txid: <span className={ style.transactionId }>{txid}</span>
          </div>
        )}
        {loading && <div className={ style.statusBox }>Loading...</div>}
        {errorMsg !== '' && <div className={ style.statusBox }>ERROR: {errorMsg}</div>}
      </React.Fragment>
    )
  }
}

SendInvoke.propTypes = {
  account: PropTypes.object,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.string,
}

const mapStateToProps = state => ({
  networks: state.config.networks,
  selectedNetworkId: state.config.selectedNetworkId,
  account: state.account,
})

export default withLoginCheck(connect(mapStateToProps)(SendInvoke))
