import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container } from "react-bootstrap";
import { withRouter } from "react-router";

class Dashboard extends React.Component {
  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <h1>Dashboard</h1>
          </Container>
        </PageContent>
      </>
    );
  }
}

export default withRouter(Dashboard);
