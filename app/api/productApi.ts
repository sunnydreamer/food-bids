const baseURL = "http://127.0.0.1:5000";


export const getProducts = async () => {
  try {
    console.log(`${baseURL}/get_products`);

    const response = await fetch(`${baseURL}/get_products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      const errorData = await response.json();
      console.error(errorData.message);
    }
  } catch (error) {
    console.error("Error getting products:", error.message);
    throw error;
  }
};
