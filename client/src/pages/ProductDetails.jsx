import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  getProductById,
  getProducts,
  getProductReviews,
  createProductReview,
} from "../services/productService";
import { useCart } from "../context/CartContext";

const tabs = ["Description", "Specifications", "Reviews"];

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { addItem } = useCart();

  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addItem(product._id, quantity);
      toast.success("Product added to cart!");
      navigate("/products");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.error(err);
      alert("Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product._id, quantity);
      toast.success("Product added to cart!");

      navigate("/checkout");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      toast.error("please write a review");
      return;
    }

    try {
      setReviewSubmitting(true);

      const reviewData = await createProductReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      toast.success("Review submitted Successfully");

      setReviews(reviewData.reviews || []);
      setProduct((currentProduct) => ({
        ...currentProduct,
        rating: reviewData.rating,
        numReviews: reviewData.numReviews,
      }));
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Failed to submit review:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setReviewLoading(true);

        try {
          const reviewData = await getProductReviews(id);
          setReviews(reviewData.reviews || []);
        } catch (error) {
          console.error("Failed to load reviews:", error);
          setReviews([]);
        } finally {
          setReviewLoading(false);
        }
        const results = await getProducts();
        setProduct(productData.product);
        setRelatedProducts(
          (results.products || [])
            .filter((item) => item._id !== id)
            .slice(0, 4),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const rating = product?.rating ?? 5;
  const badge = product?.featured ? "Featured" : "New";

  const mainImage = useMemo(() => {
    return (
      product?.images?.[0] ||
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80"
    );
  }, [product]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-600">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-600">
        Product not found.
      </div>
    );
  }

  const thumbnails = product.images?.length ? product.images : [mainImage];

  return (
    <main className="bg-[#f7f3ee] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-[#7b4f1d]">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-[#7b4f1d]">
            Products
          </Link>
          <ChevronRight size={16} />
          <span className="text-[#7b4f1d]">{product.name}</span>
        </div>

        <section className="grid gap-8 rounded-3xl bg-[#fbfaf7] p-6 shadow-[0_16px_40px_rgba(94,71,30,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-[26px] border border-[#ece4d7] bg-white p-5 shadow-sm">
              <img
                src={mainImage || "https://placehold.co/120x120?text=Product"}
                // src={item?.image || }
                alt={product.name}
                className="h-107.5 w-full rounded-[20px] object-cover"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-[#fbfaf7] p-2">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b4f1d]">
                  Premium collection
                </p>
                <h1 className="text-4xl font-black tracking-tight text-accent">
                  {product.name}
                </h1>
              </div>
              <button className="rounded-full border border-[#e8dfd1] bg-white p-3 text-slate-500 shadow-sm hover:text-red-500">
                <Heart size={18} />
              </button>
            </div>

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

            <div className="mb-5 text-3xl font-black text-primary-dark">
              KSh {product.price?.toLocaleString()}
            </div>

            <p className="mb-5 max-w-xl text-[15px] leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-accent">
                In Stock
              </span>
              <span className="text-sm text-slate-500">Ready for dispatch</span>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-md border border-[#e4dac8] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="p-3 text-slate-600 hover:bg-[#f6efe5]"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-12 text-center text-sm font-semibold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="p-3 text-slate-600 hover:bg-[#f6efe5]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                disabled={adding}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-md bg-[#7b4f1d] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#95632a]"
              >
                <ShoppingCart size={16} />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="rounded-md border border-[#7b4f1d] bg-white px-4 py-3 text-sm font-semibold text-[#7b4f1d] transition hover:bg-[#f7efe4]"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: ShieldCheck, label: "Secure Payment" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-[#ece4d7] bg-white px-4 py-3 shadow-sm"
                >
                  <div className="rounded-full bg-[#f7efe3] p-2 text-[#7b4f1d]">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#ebe3d4] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-[#efe7da] pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#7b4f1d] text-white"
                    : "bg-[#f7f3ee] text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 text-sm leading-7 text-slate-600">
            {activeTab === "Description" && <p>{product.description}</p>}
            {activeTab === "Specifications" && (
              <ul className="grid gap-2 md:grid-cols-2">
                <li className="rounded-md bg-[#f8f4ee] px-3 py-2">
                  Category: {product.category || "General"}
                </li>
                <li className="rounded-md bg-[#f8f4ee] px-3 py-2">
                  Brand: {product.brand}
                </li>
                <li className="rounded-md bg-[#f8f4ee] px-3 py-2">
                  Availability:{" "}
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </li>
                <li className="rounded-md bg-[#f8f4ee] px-3 py-2">
                  Shipping: 2-4 days
                </li>
              </ul>
            )}
            {activeTab === "Reviews" && (
              <div className="space-y-8">
                <div className="rounded-2xl bg-[#f8f4ee] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Customer Reviews
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={18}
                              className={
                                index < Math.round(rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>

                        <span className="font-semibold text-slate-700">
                          {rating.toFixed(1)}
                        </span>

                        <span className="text-slate-500">
                          ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebe3d4] bg-white p-5">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Write a Review
                  </h3>

                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Your Rating
                      </label>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="transition-transform hover:scale-110 hover:cursor-pointer"
                          >
                            <Star
                              size={24}
                              className={
                                star <= reviewRating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reviewComment"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Your Review
                      </label>

                      <textarea
                        id="reviewComment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={4}
                        className="w-full rounded-xl border border-[#e4dac8] bg-[#fbfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#7b4f1d] focus:ring-2 focus:ring-[#7b4f1d]/10"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="rounded-md bg-[#7b4f1d] hover:cursor-pointer px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#95632a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    What Customers Are Saying
                  </h3>

                  {reviewLoading ? (
                    <p className="text-sm text-slate-500">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <div className="rounded-2xl bg-[#f8f4ee] p-6 text-center">
                      <p className="text-sm text-slate-500">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="rounded-2xl border border-[#ebe3d4] bg-white p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {review.name || review.user?.name || "Customer"}
                              </h4>

                              <div className="mt-1 flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={15}
                                    className={
                                      star <= review.rating
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            {review.createdAt && (
                              <span className="text-xs text-slate-400">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Related Products
            </h2>
            <Link
              to="/products"
              className="text-sm font-semibold text-[#7b4f1d]"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
