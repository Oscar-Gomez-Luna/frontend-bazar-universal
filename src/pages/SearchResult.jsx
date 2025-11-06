import React from "react";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import { ArrowLeft, StarFill } from "react-bootstrap-icons";
import { Container, Row, Col, Card, Badge, Alert } from "react-bootstrap";

const SearchResults = () => {
  const { items, query, error } = useLoaderData();
  const location = useLocation();

  return (
    <div className="bg-dark text-white min-vh-100">
      <Container className="py-4">
        {error && (
          <Alert variant="danger">
            Problemas con el servidor intenta más tarde.
          </Alert>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="mb-1">Resultados para "{query}"</h4>
            <p className="text-light mb-0">
              {items.length} productos encontrados
            </p>
          </div>
          <Link
            to="/"
            className="btn btn-outline-light d-flex align-items-center gap-2 mb-3"
          >
            <ArrowLeft /> Volver
          </Link>
        </div>

        <Row className="g-3 g-md-4">
          {items.map((p) => (
            <Col xs={12} sm={6} lg={4} xl={3} key={p.id}>
              <Card
                className="h-100 border-0 shadow-sm"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={p.images?.[0]?.url || p.thumbnail}
                    alt={p.title}
                    style={{ maxHeight: "100%", objectFit: "contain" }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Badge bg="secondary" className="mb-2 align-self-start">
                    {p.category}
                  </Badge>
                  <h6 className="mb-2">{p.title}</h6>
                  <p className="text-muted small">{p.description}</p>
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning me-2">
                      {[...Array(Math.round(p.rating || 0))].map((_, i) => (
                        <StarFill key={i} size={14} />
                      ))}
                      {[...Array(5 - Math.round(p.rating || 0))].map((_, i) => (
                        <StarFill key={i} size={14} className="text-muted" />
                      ))}
                    </div>
                    <small className="text-muted">
                      ({p.rating?.toFixed?.(1) || "0.0"})
                    </small>
                  </div>
                  <div className="mt-auto">
                    <h5 className="text-primary mb-2">${p.price}</h5>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      {p.stock > 0 ? (
                        <small className="text-success">● En stock</small>
                      ) : (
                        <small className="text-danger">● Agotado</small>
                      )}
                      <Link
                        to={`/item/${p.id}`}
                        state={{ fromSearch: location.search }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default SearchResults;

export const loaderItems = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  if (!query) return { items: [], query, error: null };

  try {
    const res = await fetch(
      `https://api-bazar-universal.azurewebsites.net/api/items?q=${encodeURIComponent(
        query
      )}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { items: Array.isArray(data) ? data : [], query, error: null };
  } catch (err) {
    console.error(err);
    return { items: [], query, error: err.message || "Error de servidor" };
  }
};
