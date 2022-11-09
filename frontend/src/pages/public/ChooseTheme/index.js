import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

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
  const navigate = useNavigate()

  useEffect(() => {
    const theme = localStorage.getItem('@lpem:theme')

    if (theme) {
      navigate('/home')
    }
  }, [])

  function setDarkTheme() {
    localStorage.setItem('@lpem:theme', 'dark')
    navigate('/home')
  }

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
            <Button onClick={() => setDarkTheme()}>
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
