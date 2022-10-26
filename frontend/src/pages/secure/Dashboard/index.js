import React from "react";
import { Header } from "../../../shared/Header";
import {ContainerDashBoard, Elipse, ElipseBottom} from "./styles";

export function Dashboard () {
  return (
      <ContainerDashBoard>
          <Header/>

          <Elipse />
          <ElipseBottom />
      </ContainerDashBoard>
  )
}

