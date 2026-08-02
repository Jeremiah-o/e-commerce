import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const imageSrc =
    product?.images?.[1] ||
    product?.images?.[0] ||
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80";
  const rating = product?.rating ?? 5;
  const badge = product?.featured ? "Featured" : "New";

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e4ddd2] bg-white shadow-[0_10px_32px_rgba(90,68,31,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(90,68,31,0.14)]">
      <div className="relative">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b4f1d]">
          {badge}
        </span>
        <button className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-500 shadow-sm hover:text-red-500">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-text">{product.name}</h2>
        <p className=" min-h-12 text-sm text-slate-600">
          {product.description}
        </p>

        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index < Math.round(rating)
                  ? "fill-amber-500 text-amber-500"
                  : "text-gray-300"
              }
            />
          ))}

          <span className="ml-1 text-xs text-slate-500">({rating})</span>
        </div>

        <div className="mt-4">
          <span className="block text-xl font-bold text-primary-dark">
            KSh {product.price?.toLocaleString()}
          </span>

          <Link
            to={`/products/${product._id}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#95632a]"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
