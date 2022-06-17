import React from "react";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Button } from "react-bootstrap";
import { withRouter } from "react-router";

import PaymentService from "../../../services/payment";

class Payments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    handleCheckout = async () => {
        try {
            this.setState({
                isLoading: true,
            });

            const payment = new PaymentService();
            const result = await payment.checkout({
                items: [
                    {
                        id: 1,
                        quantity: 2
                    },
                    {
                        id: 2,
                        quantity: 3
                    }
                ]
            })

            console.log('result', result)

            if (result.data.url) {
                if (typeof window !== 'undefined') {
                    window.open(result.data.url, '_blank');
                }
            }

            this.setState({
                isLoading: false,
            });
        } catch (e) {
            console.log('e', e);
            this.setState({
                isLoading: false,
            });
        }

    }

    render() {
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <h1>Efetuar a compra</h1>

                        <Button
                            variant="info"
                            disabled={this.state.isLoading}
                            onClick={!this.state.isLoading ? this.handleCheckout : null}
                        >
                            {this.state.isLoading ? 'Loading…' : 'Comprar'}
                        </Button>
                    </Container>
                </PageContent>
            </>
        );
    }
}

export default withRouter(Payments);
