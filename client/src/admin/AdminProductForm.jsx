import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import { createProduct, getProductById, updateProduct, uploadProductImages } from "../services/productService";

const defaultForm = {
  name: "",
  description: "",
  category: "Electronics",
  brand: "",
  price: "",
  stock: "",
  featured: false,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [removedImageUrls, setRemovedImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { product } = await getProductById(id);
        setForm({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "Electronics",
          brand: product.brand || "",
          price: product.price || "",
          stock: product.stock || "",
          featured: product.featured || false,
        });

        const productImages = product.images || [];
        setExistingImageUrls(productImages);
        setPreviewUrls(productImages);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item?.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  const handleFileSelection = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    if (!nextFiles.length) return;

    const mappedFiles = nextFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...mappedFiles]);
    setPreviewUrls((prev) => [...prev, ...mappedFiles.map((item) => item.previewUrl)]);
  };

  const removePreview = (url) => {
    if (url?.startsWith("blob:")) {
      setSelectedFiles((prev) => {
        const next = prev.filter((item) => item.previewUrl !== url);
        URL.revokeObjectURL(url);
        return next;
      });
    } else {
      setRemovedImageUrls((prev) => [...new Set([...prev, url])]);
      setExistingImageUrls((prev) => prev.filter((item) => item !== url));
    }

    setPreviewUrls((prev) => prev.filter((item) => item !== url));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Description is required.");
      return false;
    }

    if (!form.category.trim()) {
      toast.error("Category is required.");
      return false;
    }

    if (!form.brand.trim()) {
      toast.error("Brand is required.");
      return false;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Price must be greater than zero.");
      return false;
    }

    if (!form.stock || Number(form.stock) < 0) {
      toast.error("Stock quantity must be zero or more.");
      return false;
    }

    const remainingImageCount = existingImageUrls.length + selectedFiles.length;
    if (remainingImageCount < 1) {
      toast.error("At least one product image is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setUploading(true);
      setUploadProgress(0);

      const keptExistingImages = existingImageUrls.filter((url) => !removedImageUrls.includes(url));
      let uploadedImages = [...keptExistingImages];

      if (selectedFiles.length) {
        const uploadResponse = await uploadProductImages(
          selectedFiles.map((item) => item.file),
          (percent) => setUploadProgress(percent),
        );

        uploadedImages = [...uploadedImages, ...uploadResponse.images];
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: uploadedImages,
      };

      if (id) {
        await updateProduct(id, payload);
        toast.success("Product updated successfully.");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully.");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-[#efe4d6]" />
          <div className="h-10 rounded bg-[#efe4d6]" />
          <div className="h-28 rounded bg-[#efe4d6]" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-10 rounded bg-[#efe4d6]" />
            <div className="h-10 rounded bg-[#efe4d6]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border bg-white p-6 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin products</p>
          <h1 className="mt-2 text-2xl font-black text-text md:text-3xl">
            {id ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#fbf7f1] px-4 py-2 text-sm font-semibold text-text transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-text">Product name</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-text">Description</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-text">Category</span>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Phones">Phones</option>
            <option value="Groceries">Groceries</option>
            <option value="Toys">Toys</option>
            <option value="Sports">Sports</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-text">Brand</span>
          <input
            type="text"
            value={form.brand}
            onChange={(event) => setForm({ ...form, brand: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-text">Price</span>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-text">Stock Quantity</span>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
            className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 outline-none focus:border-primary"
            required
          />
        </label>

        <div className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-text">Product Images</span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-primary/40 bg-[#fbf7f1] px-4 py-8 text-center transition hover:border-primary hover:bg-[#f7efe4]">
            <UploadCloud className="text-primary" size={24} />
            <span className="mt-3 text-sm font-semibold text-text">Upload multiple images</span>
            <span className="mt-1 text-xs text-text/60">PNG, JPG, WEBP up to 5MB each</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelection}
            />
          </label>

          {uploading && (
            <div className="rounded-xl border border-border bg-[#fbf7f1] px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-text">
                <span>Uploading images</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#efe4d6]">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-[#fbf7f1]">
                  <img src={url} alt={`${form.name || "Product"} preview ${index + 1}`} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePreview(url)}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow"
                    aria-label="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 md:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm({ ...form, featured: event.target.checked })}
          />
          <span className="text-sm font-semibold text-text">Featured Product</span>
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {(saving || uploading) && <LoaderCircle size={16} className="animate-spin" />}
            {saving || uploading ? "Saving..." : id ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
