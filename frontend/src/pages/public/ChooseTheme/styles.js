import styled from 'styled-components'

export const Background = styled.div`
  background-color: #2F3142;
  height: 100vh;
  display: flex;
`

export const WrapperLeft = styled.div`
  width: -webkit-fill-available;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

export const WrapperText = styled.div`
  color: #FFF;
  
  h1 {
    font-weight: 700;
    font-size: 80px;
  }
  
  h2 {
    margin-top: 50px;
    font-size: 40px;
    font-weight: 700;
  }
`

export const WrapperImages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-right: 100px;
`

export const Images = styled.img`
  max-width: 100%;
  margin-bottom: 20px;
`

export const WrapperButtons = styled.div`
  display: flex;
  flex-direction: row;
`

export const Button = styled.a`
  color: #FFF;
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  text-decoration: none;
  cursor: pointer;
  margin-top: 30px;
  
  // border with linear gradient effect
  border: double 2px transparent;
  background-image: linear-gradient(#2F3142, #2F3142),
  radial-gradient(circle at top left, #73E0A9, #5B68DF);
  background-origin: border-box;
  background-clip: content-box, border-box;

  &:hover {
    color: #FFF;
    background-image: linear-gradient(#73E0A9, #5B68DF),
    radial-gradient(circle at top left, #73E0A9, #5B68DF);
  }

  &:last-child {
    margin-left: 40px
  }
`
