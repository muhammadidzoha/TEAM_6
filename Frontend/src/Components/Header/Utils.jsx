import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Bell, ShoppingBasket, X } from "lucide-react";
import { getUserById } from "../../lib/user_service_api";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createOrder } from "../../lib/order_service_api";
import { toast } from "react-toastify";

const NavItemProfile = [
  { id: 1, name: "Settings", link: "/settings" },
  { id: 2, name: "History Transaction", link: "/history-transcation" },
  { id: 3, name: "Market", link: "/market" },
  { id: 4, name: "Logout", link: "#" },
];

const Utils = ({ count, setCount, cartData, setCartData, removeCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil nilai awal dari localStorage
    const cartData = JSON.parse(localStorage.getItem("cart")) || {
      count: 0,
      product: [],
    };
    setCount(cartData.count);
    setCartData(cartData.product);

    // Tambahkan event listener untuk mendeteksi perubahan pada localStorage
    const handleStorageChange = () => {
      const updatedCartData = JSON.parse(localStorage.getItem("cart")) || {
        count: 0,
        product: [],
      };
      setCount(updatedCartData.count);
      setCartData(updatedCartData.product);
    };

    window.addEventListener("storage", handleStorageChange);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  const user = async () => {
    return await getUserById(1);
  };

  const { data } = useSWR("user", user);

  if (!data) return <div>Loading...</div>;

  const filteredNavItems =
    data.role === "seller"
      ? NavItemProfile
      : NavItemProfile.filter((item) => item.id !== 3);

  const handleCheckout = async (userId, cartData) => {
    try {
      const items = cartData.map((product) => ({
        product_id: product.id,
        quantity: product.total,
        price: product.price,
      }));

      const response = await createOrder(userId, items);
      console.log(response);

      setOpen(false);
      toast.success(response.message, {
        autoClose: 1500,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      });
      navigate(`/orders/${userId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className="flex items-center space-x-5 relative">
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-black" />
        <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
          <div className="absolute -top-1.5 -right-2 text-obito-grey text-center w-5 h-4 bg-red-500 rounded-full text-xs">
            {count}
          </div>
          <ShoppingBasket size={18} className="text-black" />
        </div>
      </div>
      <div className="h-[50px] flex shrink-0 bg-obito-grey w-px"></div>
      {show && (
        <div className="absolute top-15 right-0 bg-white w-[200px] flex flex-col space-y-3 p-3 z-50 border border-obito-grey">
          {filteredNavItems.map((item) => (
            <Link
              key={item.id}
              className="hover:bg-obito-grey p-2 w-full text-start"
              to={item.link}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
      <button
        className="flex items-center gap-2 text-sm cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <img
          src="https://docs.material-tailwind.com/img/face-2.jpg"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col items-start">
          <h1>{data.username}</h1>
          <p>{data.email}</p>
        </div>
      </button>
      {open && (
        <Dialog open={open} onClose={setOpen} className="relative z-20">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
          />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <X aria-hidden="true" className="size-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cartData.length > 0 ? (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cartData.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      alt={product.id}
                                      src={product.image}
                                      className="size-full object-cover"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{product.name}</h3>
                                        <p className="text-sm font-medium text-gray-900">
                                          {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                          }).format(
                                            product.price * product.total
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Qty {product.total}
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                                          onClick={() => removeCart(product.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex items-center justify-center h-48">
                              <p className="text-gray-500">No items in cart</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(
                            cartData.reduce(
                              (acc, product) =>
                                acc + product.price * product.total,
                              0
                            )
                          )}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                          onClick={() => handleCheckout(data.id, cartData)}
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Utils;
