import React from 'react'
import { wallet } from '@cityofzion/neon-js'

import { shallow, mount } from 'enzyme'

import CreateWalletWrapped, { CreateWallet } from '../../src/app/containers/CreateWallet/CreateWallet'
import Loader from '../../src/app/components/Loader'

jest.useFakeTimers()

const accounts = {
  ARjkxk6VcKPFKqRHhuLNog9TbdYxhKu9be: {
    address: 'ARjkxk6VcKPFKqRHhuLNog9TbdYxhKu9be',
    isDefault: false,
    key: '6PYRop1b45uKRUVUngUr3g44UmH8Kg6KTVTAvxyKKJLVpxQsM5HXUPrzCB',
    label: 'TestKonto',
  },
}

const setupShallow = () => {
  const wrapper = shallow(
    <CreateWalletWrapped addAccount={ jest.fn } setAccount={ jest.fn } history={ {} } accounts={ accounts } />
  ).dive()

  return wrapper
}

const setupMount = (addAccount = jest.fn, setAccount = jest.fn, manualWIF = false) => {
  const wrapper = mount(
    <CreateWalletWrapped
      addAccount={ addAccount }
      setAccount={ setAccount }
      history={ {} }
      accounts={ accounts }
      manualWIF={ manualWIF }
    />
  ).find(CreateWallet)

  return wrapper
}

describe('CreateWallet', () => {
  test('shows loading', () => {
    const wrapper = setupShallow()

    wrapper.setState({ loading: true })
    expect(wrapper.find(Loader).length).toEqual(1)
  })

  test('Creates valid credentials', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()
    const addAccount = jest.fn()

    const wrapper = setupMount(addAccount)

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('input#label').simulate('change', { target: { id: 'label', value: 'somelabel' } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    process.nextTick(() => {
      expect(wrapper.props().errors).toEqual({})
      expect(wrapper.instance().state.encryptedWif).toBeTruthy()
      expect(wrapper.instance().state).toBeTruthy()

      expect(wallet.isAddress(wrapper.instance().state.address)).toEqual(true)
      expect(addAccount.mock.calls.length).toBe(1)
      done()
    })
  })

  test('Shows error with non matching passphrases', () => {
    const passphrase = 'city of zion'
    const passphraseConfirm = 'city of paris'

    const preventDefault = jest.fn()

    const wrapper = setupMount()

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphraseConfirm } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    const instance = wrapper.instance()

    expect(instance.props.errors.passPhraseConfirm).not.toEqual('')
    expect(instance.props.errors.passPhraseConfirm).toEqual('Passphrases do not match.')
  })

  test('passphrase must be at least 10 characters', () => {
    const passphrase = '123456789'

    const preventDefault = jest.fn()

    const wrapper = setupMount()

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    const instance = wrapper.instance()

    expect(instance.props.errors.passPhrase).not.toEqual('')
    expect(instance.props.errors.passPhrase).toEqual('Passphrase must be longer than 10 characters.')
  })

  test('Creates valid credentials with manual WIF', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()
    const addAccount = jest.fn()

    const wrapper = setupMount(addAccount, jest.fn, true)

    wrapper
      .find('input#wif')
      .simulate('change', { target: { id: 'wif', value: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr' } })
    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    // Hack WIF needs to be rewritten
    wrapper.find('input#passPhraseConfirm').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('input#label').simulate('change', { target: { id: 'label', value: 'somelabel' } })

    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    const instance = wrapper.instance()

    process.nextTick(() => {
      expect(instance.props.errors.wif).toEqual('')
      expect(instance.state.encryptedWif).toBeTruthy()
      expect(instance.state.address).toBeTruthy()

      expect(wallet.isAddress(instance.state.address)).toEqual(true)
      expect(instance.state.address).toEqual('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')
      expect(addAccount.mock.calls.length).toBe(1)
      done()
    })
  })

  test('Shows error with invalid manual WIF', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()

    const wrapper = setupMount(jest.fn, jest.fn, true)

    wrapper
      .find('input#wif')
      .simulate('change', { target: { id: 'wif', value: '!xDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr' } })
    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    process.nextTick(() => {
      expect(wrapper.instance().props.errors.wif).not.toEqual('')
      done()
    })
  })
})
