import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  background-color: #1F1D2B;
  color: #FFFFFF;
  height: 100vh;
  width: 100%;
`

export const ElipseGreen = styled.div`
  background-color: #73E0A9;
  opacity: 0.5;
  position: absolute;
  right: -5vw;
  top: 5vh;
  height: 50vw;
  width: 50vw;
  filter: blur(12vw);
`

export const ElipsePurple = styled.div`
  background-color: #5B68DF;
  position: absolute;
  left: 0;
  height: 50vw;
  width: 50vw;
  filter: blur(14vw);
  top: 30vw;
  opacity: 0.5;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 30vh;
  
  width: 100%;
  max-width: 500px;
  
  margin-left: 5vw;
`

export const Input = styled.input`
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #fff;
  margin-bottom: 10px;
  outline: none;
  
  cursor: pointer;
  color: #fff;
  
  &::placeholder {
    color: #fff;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const Button = styled.button`
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
  background:
          linear-gradient(#282845 0 0) padding-box, /*this is your grey background*/
          linear-gradient(to right, #73E0A9, #5B68DF) border-box;
  padding: 10px;
  border: 2px solid transparent;
`

export const Img = styled.img`
  position: absolute;
  right: 0;
`
