import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container } from "react-bootstrap";

class PaymentSuccess extends React.Component {
    render() {
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <h1>Success</h1>


                    </Container>
                </PageContent>
            </>
        );
    }
}

export default PaymentSuccess;
