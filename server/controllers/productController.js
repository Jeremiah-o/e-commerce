import mongoose from "mongoose";
import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      brand,
      stock,
      featured,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images,
      category,
      brand,
      stock,
      featured,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      featured,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = {};

    switch (sort) {
      case "price":
        sortOption = { price: 1 };
        break;

      case "-price":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "newest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts,
        pageSize,
        hasNextPage: pageNumber < Math.ceil(totalProducts / pageSize),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.stock = req.body.stock ?? product.stock;
    product.featured = req.body.featured ?? product.featured;

    if (req.body.images) {
      product.images = req.body.images;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "reviews rating numReviews",
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      rating: product.rating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
