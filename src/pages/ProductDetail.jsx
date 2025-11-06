import React, { useState } from "react";
import {
  useLoaderData,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { StarFill, ArrowLeft } from "react-bootstrap-icons";

const ProductDetail = () => {
  const { product, error } = useLoaderData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const fromPurchases = location.state?.from === "purchases";

  const query =
    new URLSearchParams(location.state?.fromSearch || "").get("q") || "";

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <Link
          to={`/items?q=${encodeURIComponent(query)}`}
          className="btn btn-outline-dark mt-3 d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft /> Volver
        </Link>
      </Container>
    );

  if (!product)
    return (
      <p className="text-center text-white py-5">Producto no encontrado</p>
    );

  const handleBuy = async () => {
    setLoading(true);
    setAlert(null);

    const body = {
      productoId: product.id,
      cantidad: 1,
      precio: product.price,
    };

    try {
      const res = await fetch(
        "https://api-bazar-universal.azurewebsites.net/api/addSale",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAlert({ type: "success", text: "Compra registrada correctamente" });
      setTimeout(() => navigate("/sales"), 1200);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "danger",
        text: "No se pudo registrar la compra. Intenta más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <Container className="bg-white rounded-4 shadow-sm p-4 p-md-5">
        <Link
          to={
            fromPurchases ? "/sales" : `/items?q=${encodeURIComponent(query)}`
          }
          className="btn btn-outline-dark mb-4 d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft /> {fromPurchases ? "Volver a compras" : "Volver"}
        </Link>

        {alert && (
          <Alert
            variant={alert.type}
            onClose={() => setAlert(null)}
            dismissible
            className="mb-4 text-center"
          >
            {alert.text}
          </Alert>
        )}

        <Row className="g-4">
          <Col xs={12} lg={6}>
            <Card
              className="border-0 shadow-sm mb-3"
              style={{ borderRadius: "1rem", overflow: "hidden" }}
            >
              <Card.Body className="p-0">
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "300px", minHeight: "250px" }}
                >
                  <img
                    src={
                      product.images?.[selectedImage]?.url || product.thumbnail
                    }
                    alt={product.title}
                    style={{ maxHeight: "100%", objectFit: "contain" }}
                  />
                </div>
              </Card.Body>
            </Card>

            <Row className="g-2">
              {product.images?.map((img, i) => (
                <Col xs={4} key={i}>
                  <div
                    onClick={() => setSelectedImage(i)}
                    className={`bg-light rounded d-flex align-items-center justify-content-center ${
                      selectedImage === i
                        ? "border border-primary border-3"
                        : "border"
                    }`}
                    style={{ height: "80px", cursor: "pointer" }}
                  >
                    <img
                      src={img.url}
                      alt={product.title}
                      style={{ maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col xs={12} lg={6}>
            <div className="h-100 d-flex flex-column">
              <Badge bg="secondary" className="mb-3 align-self-start">
                {product.category}
              </Badge>
              <h2 className="mb-2 text-dark">{product.title}</h2>
              <p className="text-muted small mb-1">
                SKU: {product.sku || product.id}
              </p>
              <p className="text-muted small mb-2">
                Marca: {product.brand || "Desconocida"}
              </p>
              <p className="text-muted small mb-3">
                Peso: {product.weight || "N/A"} kg | Dimensiones:{" "}
                {product.dimensions?.width || "N/A"} x{" "}
                {product.dimensions?.height || "N/A"} x{" "}
                {product.dimensions?.depth || "N/A"} cm
              </p>

              <div className="d-flex align-items-center mb-3">
                <div className="text-warning me-2">
                  {[...Array(Math.round(product.rating || 0))].map((_, i) => (
                    <StarFill key={i} size={20} />
                  ))}
                  {[...Array(5 - Math.round(product.rating || 0))].map(
                    (_, i) => (
                      <StarFill key={i} size={20} className="text-muted" />
                    )
                  )}
                </div>
                <span className="text-muted">
                  ({product.rating?.toFixed(1) || "0.0"} -{" "}
                  {product.reviews?.length || 0} reseñas)
                </span>
              </div>

              {product.discountPercentage ? (
                <h5 className="text-danger mb-4">
                  $
                  {(
                    product.price -
                    (product.price * product.discountPercentage) / 100
                  ).toFixed(2)}
                  <del className="text-muted ms-2">
                    ${product.price.toFixed(2)}
                  </del>
                </h5>
              ) : (
                <h3 className="text-primary mb-4">
                  ${product.price.toFixed(2)}
                </h3>
              )}
              <Card
                className="border-0 bg-light mb-4"
                style={{ borderRadius: "1rem" }}
              >
                <Card.Body className="p-3">
                  <h6 className="mb-2">Descripción:</h6>
                  <p className="mb-0 text-muted">{product.description}</p>
                </Card.Body>
              </Card>

              <Row className="g-2 mb-4">
                <Col xs={12} sm={6}>
                  <div className="p-3 bg-light text-dark rounded text-center">
                    <small className="text-muted d-block">Envío</small>
                    <strong>{product.shippingInformation || "Gratis"}</strong>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="p-3 bg-light rounded text-center">
                    <small className="text-muted d-block">Disponibilidad</small>
                    <strong
                      className={
                        product.stock > 0 ? "text-success" : "text-danger"
                      }
                    >
                      {product.stock > 0 ? "En stock" : "Agotado"}
                    </strong>
                  </div>
                </Col>
              </Row>

              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-fill"
                  onClick={handleBuy}
                  disabled={loading || product.stock <= 0}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : fromPurchases ? (
                    "Volver a comprar"
                  ) : (
                    "Comprar ahora"
                  )}
                </Button>
              </div>

              <Card className="mb-3">
                <Card.Body>
                  <h6>Reseñas:</h6>
                  {product.reviews?.length ? (
                    product.reviews.map((r) => (
                      <p key={r.reviewId} className="small text-muted">
                        "{r.comment}" - {r.reviewerName}
                      </p>
                    ))
                  ) : (
                    <p className="small text-muted">Sin reseñas aún.</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;

export const loaderProductDetail = async ({ params }) => {
  const { id } = params;
  if (!id) return { product: null, error: "Producto no encontrado" };

  try {
    const res = await fetch(
      `https://api-bazar-universal.azurewebsites.net/api/items/${id}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { product: data, error: null };
  } catch (err) {
    console.error(err);
    return {
      product: null,
      error: "Solicitudes agotadas o servidor no disponible.",
    };
  }
};
