import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Button } from 'rmwc/Button'
import { TextField } from 'rmwc/TextField'
import { Select } from 'rmwc/Select'
import '@material/button/dist/mdc.button.min.css'
import '@material/textfield/dist/mdc.textfield.min.css'
import '@material/select/dist/mdc.select.min.css'

import { callInvoke } from '../../utils/neonWrappers'

import style from './SendInvoke.css'
import tempStyle from '../App/App.css'

import withLoginCheck from '../../components/Login/withLoginCheck'

@connect(state => ({
  networks: state.config.networks,
  selectedNetworkId: state.config.selectedNetworkId,
  account: state.account,
}))
  
class SendInvoke extends Component {
  state = {
    loading: false,
    errorMsg: '',
    txid: '',
    args: [''],
    assetType: 'GAS',
    assetAmount: '0.00025',
  }

  _handleTextFieldChange = e => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })
  }

  _handleArgChange = (id, e) => {
    const myArgs = this.state.args
    myArgs[id] = e.target.value

    this.setState({ args: myArgs })
  }

  _handleAddArgument = e => {
    e.preventDefault()
    this.setState({ args: this.state.args.concat(['']) })
  }

  _handleRemoveArg = (id, e) => {
    e.preventDefault()
    this.setState({ args: this.state.args.filter((s, idx) => id !== idx) })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { selectedNetworkId, networks, account } = this.props

    this.setState({
      loading: true,
      errorMsg: '',
      txid: '',
    })

    if (!this.state.scriptHash || !this.state.operation) {
      this.setState({
        loading: false,
        errorMsg: 'Error! Script hash and operation are required!',
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
        <form onSubmit={ this.handleSubmit } style={ { paddingTop: '35px' } } className={ tempStyle.tempFormStyle }>
          <TextField
            type='text'
            placeholder='Script Hash'
            value={ this.state.scriptHash }
            id='scriptHash'
            onChange={ this._handleTextFieldChange }
          />
          <TextField
            type='text'
            placeholder='Operation'
            value={ this.state.operation }
            id='operation'
            onChange={ this._handleTextFieldChange }
          />

          <div className={ style.argsWrapper } style={ { marginBottom: '-20px' } }>
            {this.state.args.map((arg, idx) => (
              <React.Fragment>
                <TextField
                  style={ { flexGrow: 1, order: 1 } }
                  type='text'
                  key={ `input-${idx + 1}` }
                  placeholder={ `Argument #${idx + 1}` }
                  value={ arg }
                  id={ `Argument #${idx + 1} name` }
                  onChange={ (event) => this._handleArgChange(idx, event) }
                />
                <Button
                  key={ `btn-${idx + 1}` }
                  raised
                  ripple
                  style={ { flexGrow: 0, order: 0 } }
                  onClick={ (event) => this._handleRemoveArg(idx, event) }>
                  -
                </Button>
              </React.Fragment>
            ))}
          </div>
          <TextField
            type='text'
            placeholder='Amount'
            value={ this.state.assetAmount }
            id='assetAmount'
            onChange={ this._handleTextFieldChange }
          />
          <Select
            cssOnly
            label='Asset'
            value={ this.state.assetType }
            onChange={ e => {
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
          <div className={ style.argsWrapper } style={ { marginTop: '0px' } }>

            <Button className={ style.btn } style={ { marginLeft: 2, order: 3 } } raised ripple onClick={ this._handleAddArgument }>Add
            Argument</Button>
            <Button className={ style.btn } style={ { marginRight: 2 } } raised ripple disabled={ this.state.loading }>
            Invoke
            </Button>
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

export default withLoginCheck(SendInvoke)

SendInvoke.propTypes = {
  account: PropTypes.object,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.string,
}
