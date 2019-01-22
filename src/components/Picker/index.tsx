import React from 'react'

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

import varibles from '../../common/styles/variables'
import pickerStyles from './styles'
import { Icon } from '../Icon'
import { SlideModal } from '../SlideModal'

const screen = Dimensions.get('window')

export interface PickerProps {
  label?: string,
  renderLabel?: Function
  disabled?: boolean,
  style?: any,
  cancelable?: boolean
  toggle?: Function
}

export interface PickerState {
  active?: boolean,
  offsetY?: number
}

export class Picker extends React.Component<PickerProps, PickerState> {
  private slideModal = null
  private trigger = null
  static defaultProps = {
    label: '请选择',
    disabled: false,
    cancelable: true,
    renderLabel: null,
    style: {},
    toggle: null
  }

  constructor (props) {
    super(props)

    this.state = {
      active: false
    }
  }

  toggle = () => {
    const { disabled, toggle } = this.props
    if (disabled) {
      return
    }
    let { active } = this.state
    active = !active
    this.setState({
      active
    })
    toggle && toggle(active)

    if (active) {
      this.open()
    } else {
      this.close()
    }
  }

  close () {
    return this.slideModal.close().catch((e) => {
      // console.log(e)
    })
  }

  open () {
    this.trigger.measure((fx, fy, width, height, px, py) => {
      this.setState({
        offsetY: py + height
      })
      this.slideModal.open().catch((e) => {
        // console.log(e)
      })
    })
  }

  renderIcon (active, size, tintColor) {
    size = size - 3
    const type = active ? 'caret-up' : 'caret-down'

    return <Icon type={type} size={size} tintColor={tintColor} />
  }

  render () {
    let { style, disabled, label, cancelable, renderLabel } = this.props
    const { active, offsetY } = this.state
    const fontSize = StyleSheet.flatten(pickerStyles.btnText).fontSize
    let fontColor = StyleSheet.flatten(pickerStyles.btnText).color

    if (active) {
      fontColor = varibles.mtdBrandPrimaryDark
    }

    return (
      <View
        ref={(c) => {
          this.trigger = c
        }}
        style={[
          style
        ]}>
        <TouchableOpacity
          onPress={this.toggle}
          activeOpacity={1}>

          {
            renderLabel ? renderLabel(active) :
            <View
              style={[
                pickerStyles.btnWrapper,
                {
                  opacity: disabled ? 0.3 : 1
                }
              ]}>
              <Text
                style={[
                  pickerStyles.btnText,
                  {
                    fontSize,
                    color: fontColor
                  }
                ]}>
                {label} { this.renderIcon(active, fontSize, fontColor) }
              </Text>
            </View>
          }
        </TouchableOpacity>

        <SlideModal
          ref={c => {
            this.slideModal = c
          }}
          cancelable={cancelable}
          direction={'down'}
          offsetX={0}
          offsetY={offsetY}
          onClosed={() => {
            if (this.state.active) {
              this.setState({
                active: false
              })
            }
          }}>
          <View
            style={{
              width: screen.width
            }}>
            { this.props.children }
          </View>
        </SlideModal>
      </View>
    )
  }
}
