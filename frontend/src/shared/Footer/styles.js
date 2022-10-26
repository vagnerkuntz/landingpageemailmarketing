import styled from 'styled-components'

export const ContainerFooter = styled.div`
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
  right: -5%;
  top: 5vh;
  height: 50%;
  width: 50%;
  filter: blur(12vw);
`

export const ElipseBottom = styled.div`
  background-color: #5B68DF;
  position: absolute;
  left: 0;
  height: 50%;
  width: 50%;
  -webkit-filter: blur(12vw);
  filter: blur(14vw);
  opacity: 0.5;
`

export const Footer = styled.footer`
  color: #fff;
  margin-top: 150px;
  margin-bottom: 150px;
`

export const Titleh2 = styled.h2`
  background: -webkit-linear-gradient(#73E0A9, #5B68DF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
