import { useState, useEffect, useRef } from "react";
import { Card, Row, Col } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      fetchMoreItems();
    }
  }

  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [products]);

  async function fetchMoreItems() {
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${page * 10}`
    );
    const data = await response.json();
    if (data.products.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setPage((prevPage) => prevPage + 1);
    }
  }

  return (
    <>
      {products.map((item) => (
        <Card
          key={item.id}
          style={{ width: "600px", margin: "0 auto" }}
          className="'mb-2"
        >
          <Col md={4}>
            <img
              src={item.thumbnail}
              alt="Product image"
              style={{ width: "100%", margin: "10px" }}
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Text>{item.description}</Card.Text>
              <Card.Text>{item.price}</Card.Text>
            </Card.Body>
          </Col>
        </Card>
      ))}
      {hasMore && (
        <div ref={elementRef} style={{ textAlign: "center" }}>
          Load more items...
        </div>
      )}
    </>
  );
}

export default App;
