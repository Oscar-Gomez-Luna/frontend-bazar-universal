import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { Bag, Search } from "react-bootstrap-icons";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/items?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={6}>
            <div className="text-center mb-4">
              <div
                className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "100px", height: "100px" }}
              >
                <Bag size={50} className="text-primary" />
              </div>
              <h1 className="display-5 fw-bold mb-2">Bazar Universal</h1>
              <p>Encuentra los mejores productos al mejor precio</p>
            </div>

            <Card className="border-0 shadow bg-opacity-25">
              <Card.Body className="p-4">
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Buscar productos..."
                        size="lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pe-5"
                      />
                      <Search
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                        size={20}
                      />
                    </div>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100"
                  >
                    <Search className="me-2" />
                    Buscar
                  </Button>

                  <Link
                    to="/sales"
                    className="btn btn-secondary btn-lg w-100 mt-3"
                  >
                    Compras
                  </Link>
                </Form>
              </Card.Body>
            </Card>

            <div className="mt-4">
              <small className="d-block text-center mb-2">
                Búsquedas populares:
              </small>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {["Mascara", "Eyeshadow", "Canister", "Calvin"].map((tag) => (
                  <Badge
                    key={tag}
                    bg="light"
                    text="dark"
                    className="px-3 py-2"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/items?q=${encodeURIComponent(tag)}`)
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchBox;
