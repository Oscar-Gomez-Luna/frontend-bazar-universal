import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Bag, ArrowLeft, Calendar3, Tag, BoxSeam } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const RegisteredPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          "https://api-bazar-universal.azurewebsites.net/api/sales"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPurchases(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las compras. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading)
    return (
      <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="light" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center fw-bold">
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Button
            variant="outline-light"
            className="d-flex align-items-center gap-2 mx-auto"
            onClick={() => navigate("/")}
          >
            <ArrowLeft /> Volver
          </Button>
        </div>
      </Container>
    );

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <Container className="py-4 py-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="light"
            className="d-flex align-items-center rounded-3 shadow-sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="me-2" />
            Volver
          </Button>
        </div>
        <Row className="g-3 g-md-4">
          {purchases.length === 0 && (
            <p className="text-center text-white">
              No se han registrado compras aún.
            </p>
          )}

          {purchases.map((purchase) => (
            <Col xs={12} key={purchase.id}>
              <Card className="shadow-sm border-0 h-100 rounded-4 bg-light text-dark">
                <Card.Body className="p-3 p-md-4">
                  <Row className="align-items-center g-3">
                    <Col xs={12} md={3} className="text-center">
                      <div
                        className="bg-white rounded-4 shadow-sm d-flex align-items-center justify-content-center p-2"
                        style={{ height: "140px", overflow: "hidden" }}
                      >
                        <img
                          src={
                            purchase.producto?.images?.[0]?.url ||
                            purchase.producto?.thumbnail ||
                            "https://via.placeholder.com/150"
                          }
                          alt={purchase.producto?.title}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </Col>

                    <Col xs={12} md={6}>
                      <h5 className="fw-bold mb-2 text-dark">
                        {purchase.producto?.title || "Producto desconocido"}
                      </h5>
                      <p className="text-muted small mb-2">
                        {purchase.producto?.description?.slice(0, 80)}...
                      </p>
                      <div className="mb-2 d-flex flex-wrap gap-2">
                        <Badge bg="info" className="text-dark">
                          <Tag size={14} className="me-1" />
                          {purchase.producto?.category || "Sin categoría"}
                        </Badge>
                        {purchase.producto?.brand && (
                          <Badge bg="secondary">
                            <BoxSeam size={14} className="me-1" />
                            {purchase.producto.brand}
                          </Badge>
                        )}
                        <Badge
                          bg={
                            purchase.producto?.stock > 0 ? "success" : "danger"
                          }
                        ></Badge>
                      </div>
                      <p className="text-muted small mb-0">
                        <Calendar3 size={14} className="me-1" />
                        Fecha de compra:{" "}
                        {new Date(purchase.fechaCompra).toLocaleDateString()}
                      </p>
                      <p className="text-muted small mb-0">
                        Cantidad: <strong>{purchase.cantidad}</strong>
                      </p>
                    </Col>

                    <Col xs={12} md={3} className="text-md-end">
                      <h4 className="text-primary mb-2">
                        ${purchase.total?.toFixed(2) || 0}
                      </h4>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100 w-md-auto rounded-3"
                        onClick={() =>
                          navigate(`/item/${purchase.productoId}`, {
                            state: { from: "purchases" },
                          })
                        }
                      >
                        Ver detalles
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default RegisteredPurchases;
