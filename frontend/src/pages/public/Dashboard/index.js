import Header from "../Header";
import Container from 'react-bootstrap/Container';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {
  ContainerDashBoard,
  Elipse,
  ElipseBottom,
  CirculoFundoWrapper,
  WrapperText,
  WrapperButtons,
  Button,
  WrapperContasVerificadas,
  CardBorder,
  Card,
  CirculoCardImg
} from './styles'

import CirculoFundo from '../../../assets/images/circulo_fundo_login.svg'
import CardImage from '../../../assets/images/card.svg'

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const DashboardPagePublic = () => {
  return (
    <ContainerDashBoard>
      <Header/>

      <Elipse />
      <ElipseBottom />

      <CirculoFundoWrapper>
        <img src={CirculoFundo} alt="" />
      </CirculoFundoWrapper>

      <WrapperText>
        <Container>
        <h1>LPEM Landing Page & E-mail Marketing</h1>

        <WrapperButtons>
          <Button href="">
            Explorar
          </Button>
          <Button fundo href="">
            Criar
          </Button>
        </WrapperButtons>
        </Container>
      </WrapperText>

      <Container style={{ zIndex: 1}}>
        <WrapperContasVerificadas>
          <span style={{ fontSize: 28 }}>Contas verificadas</span>
          <span>Ver todas</span>
        </WrapperContasVerificadas>

        <Carousel responsive={responsive}>
          <div>
            <CardBorder>
              <Card>
                <img alt="" src={CardImage} />
              </Card>
              <CirculoCardImg>
                <span>*</span>
              </CirculoCardImg>
              <h1>John Doe</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>
            </CardBorder>
          </div>
          <div>
            <CardBorder>
              <Card>
                <img alt="" src={CardImage} />
              </Card>
              <CirculoCardImg>
                <span>*</span>
              </CirculoCardImg>
              <h1>John Doe</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>
            </CardBorder>
          </div>
          <div>
            <CardBorder>
              <Card>
                <img alt="" src={CardImage} />
              </Card>
              <CirculoCardImg>
                <span>*</span>
              </CirculoCardImg>
              <h1>John Doe</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>
            </CardBorder>
          </div>
          <div>
            <CardBorder>
              <Card>
                <img alt="" src={CardImage} />
              </Card>
              <CirculoCardImg>
                <span>*</span>
              </CirculoCardImg>
              <h1>John Doe</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>
            </CardBorder>
          </div>
          <div>
            <CardBorder>
              <Card>
                <img alt="" src={CardImage} />
              </Card>
              <CirculoCardImg>
                <span>*</span>
              </CirculoCardImg>
              <h1>John Doe</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>
            </CardBorder>
          </div>
        </Carousel>

      </Container>
    </ContainerDashBoard>
  )
}

export default DashboardPagePublic
