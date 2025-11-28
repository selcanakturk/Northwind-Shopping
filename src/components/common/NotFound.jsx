import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";

const NotFound = () => {
    return (
        <Container className="text-center mt-5">
            <div className="py-5">
                <h1 className="display-1">404</h1>
                <h2 className="mb-4">Sayfa Bulunamadı</h2>
                <p className="lead mb-4">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>
                <Link to="/">
                    <Button color="primary" size="lg">
                        Ana Sayfaya Dön
                    </Button>
                </Link>
            </div>
        </Container>
    );
};

export default NotFound;
