import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container } from "react-bootstrap";
import { withRouter } from "react-router";

class PaymentCancel extends React.Component {
    render() {
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <h1>Cancel</h1>


                    </Container>
                </PageContent>
            </>
        );
    }
}

export default withRouter(PaymentCancel);
