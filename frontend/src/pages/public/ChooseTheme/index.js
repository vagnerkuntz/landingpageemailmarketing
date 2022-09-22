import React from 'react';

import {
  Background,
  WrapperText,
  WrapperImages,
  Images,
  WrapperLeft,
  WrapperButtons,
  Button
} from './styles'

import ChooseWhiteTheme from '../../../assets/images/choose_white_theme.svg'
import ChooseDarkTheme from '../../../assets/images/choose_dark_theme.svg'

const ChooseTheme = () => {
  return (
    <Background>
      <WrapperLeft>
        <WrapperText>
          <h1>LPEM</h1>

          <h2>
            Landing Page &<br />
            E-mail Marketing
          </h2>

          <WrapperButtons>
            <Button>Tema Claro</Button>
            <Button href="/home">
              Tema Escuro
            </Button>
          </WrapperButtons>
        </WrapperText>
      </WrapperLeft>
      <WrapperImages>
        <Images alt="" src={ChooseWhiteTheme} />
        <Images alt="" src={ChooseDarkTheme} />
      </WrapperImages>

    </Background>
  )
}

export default ChooseTheme
