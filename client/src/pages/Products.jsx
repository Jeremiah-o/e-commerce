import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { keyword } = useParams();

  const fetchProducts = async () => {
    const url = keyword ? `/products?keyword=${keyword}` : "/products";

    const { data } = await api.get(url);

    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Ksh {product.price}</p>
        </div>
      ))}
      <h1>Products</h1>
    </div>
  );
};

export default Products;
