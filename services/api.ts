import { Product } from "@/types/Product";

const BASE_URL = "https://fakestoreapi.com";

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

const formatProduct = (
  product: FakeStoreProduct
): Product => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    brand: "EliteMart",
    price: product.price,
    discountPercentage: 0,
    rating: product.rating?.rate ?? 0,
    stock: 20,
    thumbnail: product.image,
    images: [product.image],
  };
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data: FakeStoreProduct[] =
      await response.json();

    return data.map(formatProduct);
  } catch (error) {
    console.log("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (
  id: string
): Promise<Product | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data: FakeStoreProduct =
      await response.json();

    return formatProduct(data);
  } catch (error) {
    console.log("Error fetching product:", error);
    return null;
  }
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${encodeURIComponent(
        category
      )}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch category products"
      );
    }

    const data: FakeStoreProduct[] =
      await response.json();

    return data.map(formatProduct);
  } catch (error) {
    console.log(
      "Error fetching category products:",
      error
    );

    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/categories`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.log(
      "Error fetching categories:",
      error
    );

    return [];
  }
};