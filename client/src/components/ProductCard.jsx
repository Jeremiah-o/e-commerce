import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    //todo: change image source to 0 for it to work well
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={product.images[1]}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold">{product.name}</h2>

        <p className="text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">
            KSh {product.price.toLocaleString()}
          </span>

          <Link
            to={`/products/${product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;