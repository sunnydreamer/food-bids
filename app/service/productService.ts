// userService.js
import { getProducts } from "../api/productApi";

export const getAllProducts = async () => {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    throw error;
  }
};
