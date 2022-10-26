import React from 'react'
import { Container, Col, Row } from "react-bootstrap";

import * as S from './styles'
import {Elipse, ElipseBottom} from "../../pages/public/Dashboard/styles";

export function Footer () {
  return (
    <S.ContainerFooter>
      <S.Elipse />
      <S.ElipseBottom />

      <S.Footer>
        <Container>
          <Row>
            <Col>
              <h1>LPEM</h1>
              <p>
                Nossos serviços são feitos para facilitar a sua vida, em nosso sistema você encontra,
                diversos layouts e e-mails marketing customizáveis para sua empresa!
              </p>
            </Col>

            <Col>
              <S.Titleh2>Companhia</S.Titleh2>
              <p>Sobre</p>
              <p>Carreira</p>
              <p>Empreendimentos</p>
            </Col>
            <Col>
              <S.Titleh2>Status</S.Titleh2>
              <p>Rankings</p>
              <p>Atividades</p>
            </Col>
            <Col>
              <S.Titleh2>Recursos</S.Titleh2>
              <p>Centro de ajuda</p>
              <p>Marketplace</p>
              <p>Blog</p>
            </Col>
          </Row>
        </Container>
      </S.Footer>
    </S.ContainerFooter>
  )
}
