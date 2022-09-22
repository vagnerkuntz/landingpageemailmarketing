import styled, { css } from 'styled-components'

export const ContainerDashBoard = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #1F1D2B;
  height: 100vw;
`

export const Elipse = styled.div`
  background-color: #73E0A9;
  opacity: 0.5;
  position: absolute;
  right: -5vw;
  top: 5vh;
  height: 50vw;
  width: 50vw;
  filter: blur(12vw);
`

export const ElipseBottom = styled.div`
  background-color: #5B68DF;
  position: absolute;
  left: 0;
  height: 50vw;
  width: 50vw;
  -webkit-filter: blur(12vw);
  filter: blur(14vw);
  top: 30vw;
  opacity: 0.5;
`

export const CirculoFundoWrapper = styled.div`
  position: absolute;
  right: 0;
`

export const WrapperText = styled.div`
  h1 {
    color: #fff;
    margin-top: 36vh;
  }
`

export const WrapperButtons = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 1;
`

export const Button = styled.a`
${({ fundo }) => css`
  color: #FFF;
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  text-decoration: none;
  cursor: pointer;
  margin-top: 60px;
  
  // border with linear gradient effect
  border: double 2px transparent;
  background-image: linear-gradient(transparent, #2F3142),
  radial-gradient(circle at top left, #73E0A9, #5B68DF);
  background-origin: border-box;
  background-clip: content-box, border-box;

  z-index: 1;
  box-shadow: 5px 5px 15px 0px #000000;
  
  ${!!fundo && `
    background-image: linear-gradient(transparent, #2F3142),
    radial-gradient(circle at top left, #73E0A9, #5B68DF);
  `}
  
    &:hover {
      color: #FFF;
      background-image: linear-gradient(#73E0A9, #5B68DF),
      radial-gradient(circle at top left, #73E0A9, #5B68DF);
    }
  
    &:last-child {
      margin-left: 40px
    }
  `}
`

export const WrapperContasVerificadas = styled.div`
  display: flex;
  color: #fff;
  margin-top: 42vh;
  margin-bottom: 3vh;
  align-items: center;
  justify-content: space-between;
  
  span:last-child {
    margin-top: 0;
  }
`

export const CardBorder = styled.div`
  width: 260px;
  height: 400px;

  border: double 1px transparent;
  border-radius: 30px;
  background-image: linear-gradient(#2d2e53, #323361),
  linear-gradient(to bottom, #73E0A9, #5B68DF);
  background-origin: border-box;
  background-clip: content-box, border-box;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    padding: 20px;
  }
  
  h1 {
    color: #fff;
    font-size: 1.6rem;
    margin-top: 15px;
  }
  
  p {
    line-height: 1;
    color: #fff;
    text-align: center;
    font-weight: 300;
  }
`

export const Card = styled.div`
  color: #fff;
  text-align: center;
`

export const CirculoCardImg = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-top: -42px;
  color: #fff;

  // border with linear gradient effect
  border: double 2px transparent;
  background-image: linear-gradient(transparent, transparent),
  radial-gradient(circle at top left, #73E0A9, #5B68DF);
  background-origin: border-box;
  background-clip: content-box, border-box;
  
  span {
    font-size: 30px;
    margin-top: 10px;
  }
`
