import React from "react";
import { HSOverlay, HSStaticMethods } from "preline/preline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ButtonGroup = () => {
  const [user, setUser] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, [user]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(storedCart.reduce((sum, item) => sum + (item.qty || 1), 0));
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(false);
    window.location.reload();
  };

  // --- HANDLE CHECKOUT ---
  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!user || !user.id || cart.length === 0) {
      toast.error("Silakan login dan pastikan cart tidak kosong.");
      return;
    }

    const totalTagihan = cart.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    );

    const createOrderMutation = `
    mutation CreateOrder($data: createOrder!) {
      createOrder(data: $data) {
        data { id }
        message
      }
    }
  `;
    const createOrderItemMutation = `
    mutation CreateOrderItem($data: createOrderItem!) {
      createOrderItem(data: $data) {
        data { id }
        message
      }
    }
  `;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    toast.promise(
      (async () => {
        // 1. Create Order
        const orderRes = await axios.post(
          import.meta.env.VITE_ORDER_SERVICE_URL,
          {
            query: createOrderMutation,
            variables: {
              data: {
                userId: user.id,
                totalPrice: totalTagihan,
              },
            },
          }
        );
        const orderId = orderRes.data.data.createOrder.data.id;

        // 2. Create Order Items
        for (const item of cart) {
          await axios.post(import.meta.env.VITE_ORDER_SERVICE_URL, {
            query: createOrderItemMutation,
            variables: {
              data: {
                orderId,
                productId: item.id,
                quantity: item.qty,
                price: item.price,
              },
            },
          });
        }

        // 3. Simpan orderId ke localStorage
        localStorage.setItem("currentOrderId", orderId);

        // 4. Delay biar toast success terlihat
        await delay(1000);

        return "Order berhasil dibuat!";
      })(),
      {
        pending: "Memproses pesanan...",
        success: {
          render({ data }) {
            return data;
          },
          onClose: () => {
            HSOverlay.close("#hs-offcanvas-right");
            navigate("/order");
          },
        },
        error: {
          render({ data }) {
            if (data?.response?.data?.errors?.[0]?.message) {
              return data.response.data.errors[0].message;
            }
            return "Gagal membuat order.";
          },
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
      <button
        type="button"
        className="size-9.5 relative flex justify-center items-center rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="sr-only">Search</span>
        <svg
          className="shrink-0 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </button>

      <button
        type="button"
        className="size-9.5 relative flex justify-center items-center rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
        aria-controls="hs-offcanvas-right"
        data-hs-overlay="#hs-offcanvas-right"
      >
        <span className="sr-only">Cart</span>
        <svg
          className="shrink-0 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      <div
        id="hs-offcanvas-right"
        className="hs-overlay hs-overlay-open:translate-x-0 hidden translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-xs w-full z-80 bg-white border-s border-gray-200"
        aria-labelledby="hs-offcanvas-right-label"
      >
        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 id="hs-offcanvas-right-label" className="font-bold text-gray-800">
            Cart
          </h3>
          <button
            type="button"
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Close"
            data-hs-overlay="#hs-offcanvas-right"
          >
            <span className="sr-only">Close</span>
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4 flex flex-col space-y-5">
          {(() => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
              return (
                <div className="text-gray-500 text-center py-4">
                  Cart kosong
                </div>
              );
            }
            return cart.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 w-full max-h-60 overflow-y-auto p-2 rounded-lg"
              >
                <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-black line-clamp-2 overflow-hidden">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">Qty: {item.qty}</div>
                  </div>
                  <div className="font-semibold text-black">
                    Rp{(item.price * (item.qty || 1)).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
        <div className="p-4 w-full flex justify-end">
          <button
            className="bg-yellow-400 px-2 w-full text-center text-black py-2 rounded-lg"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      {user && user.id ? (
        <div className="hs-dropdown relative inline-flex">
          <button
            id="hs-dropdown-custom-trigger"
            type="button"
            className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <img
              className="w-8 h-auto rounded-full"
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="Avatar"
            />
            <span className="text-gray-600 font-medium truncate max-w-30">
              {user.name}
            </span>
            <svg
              className="hs-dropdown-open:rotate-180 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div
            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="hs-dropdown-custom-trigger"
          >
            <div className="p-1 space-y-0.5">
              <button
                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-transparent bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-hidden focus:bg-yellow-500 transition disabled:opacity-50 disabled:pointer-events-none"
          >
            <a href="/auth/login">Login</a>
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium text-nowrap rounded-xl border border-yellow-400 text-black hover:bg-yellow-50 focus:outline-hidden transition disabled:opacity-50 disabled:pointer-events-none"
          >
            <a href="/auth/register">Register</a>
          </button>
        </div>
      )}

      <div className="lg:hidden">
        <button
          type="button"
          className="hs-collapse-toggle size-9.5 flex justify-center items-center text-sm font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          id="hs-pro-hcail-collapse"
          aria-expanded="false"
          aria-controls="hs-pro-hcail"
          aria-label="Toggle navigation"
          data-hs-collapse="#hs-pro-hcail"
        >
          <svg
            className="hs-collapse-open:hidden shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
          <svg
            className="hs-collapse-open:block hidden shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ButtonGroup;
