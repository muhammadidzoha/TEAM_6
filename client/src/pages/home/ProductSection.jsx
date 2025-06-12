import useSWR from "swr";
import axios from "axios";
import { toast } from "react-toastify";

const ProductSection = () => {
  const handleAddToCart = (product) => {
    let cart = [];
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      if (Array.isArray(stored)) {
        cart = stored;
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
      cart = [];
    }
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
      toast.info("Berhasil menambahkan produk ke cart!");
    } else {
      cart.push({ ...product, qty: 1 });
      toast.success("Berhasil menambahkan produk ke cart!");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated")); // <-- Tambahkan di sini
  };

  const query = `
    query getProducts {
      products {
        products {
          id
          name
          description
          stock
          price
          imageUrl
        }
        message
      }
    }
  `;

  // Gunakan POST untuk GraphQL
  const fetcher = async () => {
    const response = await axios.post(
      import.meta.env.VITE_PRODUCT_SERVICE_URL,
      { query }
    );
    return response.data.data.products.products;
  };

  const { data } = useSWR("products", fetcher);

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 py-12 lg:py-24 mx-auto">
      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {data?.map((product) => (
          <div key={product.id} className="group flex flex-col">
            <div className="relative">
              <div className="aspect-4/4 overflow-hidden rounded-2xl">
                <img
                  className="size-full object-cover rounded-2xl"
                  src={product.imageUrl}
                  alt={product.name}
                />
              </div>

              <div className="pt-4">
                <h3 className="font-medium md:text-lg text-black">
                  {product.name}
                </h3>
                <p className="mt-2 font-semibold text-black">
                  Rp{product.price.toLocaleString("id-ID")}
                </p>
              </div>

              <a
                className="after:absolute after:inset-0 after:z-1"
                href="#"
              ></a>
            </div>

            <div className="mb-2 mt-4 text-sm">
              <div className="flex flex-col">
                {/* Item */}
                <div className="py-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-black">
                        Description:
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-black">{product.description}</span>
                    </div>
                  </div>
                </div>
                {/* End Item */}
                <div className="py-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-black">Stock:</span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-black">{product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button
                className="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-transparent bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-hidden focus:bg-yellow-500 transition disabled:opacity-50 disabled:pointer-events-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
