import React, { useState } from "react";
import axios from "axios";

const OrderSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState(""); // Tambahkan state baru
  const cart = React.useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, []);
  const user = React.useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      return stored || null;
    } catch {
      return null;
    }
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      return;
    }
    if (cart.length === 0) {
      alert("Cart kosong!");
      return;
    }
    if (!paymentMethod) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    if (!shippingMethod) {
      alert("Pilih metode pengiriman terlebih dahulu!");
      return;
    }

    try {
      const createOrderMutation = `
        mutation CreateOrder($data: CreateOrderInput!) {
          createOrder(data: $data) {
            data { id }
            message
          }
        }
      `;
      const orderRes = await axios.post(
        import.meta.env.VITE_ORDER_SERVICE_URL,
        {
          query: createOrderMutation,
          variables: {
            data: {
              userId: user.id,
              totalPrice,
            },
          },
        }
      );
      const orderId = orderRes.data.data.createOrder.data.id;

      const createOrderItemMutation = `
        mutation CreateOrderItem($data: CreateOrderItemInput!) {
          createOrderItem(data: $data) {
            data { id }
            message
          }
        }
      `;
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

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      alert("Pembayaran berhasil! Order telah dibuat.");
      window.location.href = "/";
    } catch (err) {
      alert("Gagal melakukan pembayaran.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Payment
        </h2>
        <div className="flex gap-[50px] relative mt-5">
          <div className="flex flex-col space-y-5 w-[70%]">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h1 className="uppercase text-sm font-semibold text-obito-text-secondary">
                Alamat Pengiriman
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1 mt-3">
                  <div className="flex items-center gap-2">
                    {/* <MapPin size={16} /> */}
                    <div className="flex items-center text-sm font-semibold space-x-1">
                      <h1>Rumah</h1>
                      <p>•</p>
                      <span>{user?.name || "DefaultUser"}</span>
                    </div>
                  </div>
                  <div className="text-sm font-light">
                    Jl. Telekomunikasi No.57, Bandung Kidul, Kota Bandung, Jawa
                    Barat, 6287896477662
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                    Ganti
                  </span>
                </div>
              </div>
            </div>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-lg border border-gray-200"
                >
                  <h1 className="uppercase text-sm font-semibold text-obito-text-secondary">
                    Pesanan {index + 1}
                  </h1>
                  <div className="flex items-start gap-4 mt-3">
                    {/* Gambar Produk */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    {/* Detail Produk */}
                    <div className="flex flex-col space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-light text-gray-900">
                          {item.name}
                        </h2>
                        <div className="flex space-x-0.5">
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">{item.qty}</span>
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">X</span>
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(item.price)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Tidak ada data pesanan.
              </div>
            )}
          </div>
          <div className="sticky top-0 bg-white rounded-sm w-[30%] h-max flex flex-col border border-gray-200">
            <div className="p-5 flex items-center justify-between">
              <h1 className="text-base font-semibold text-gray-900">
                Metode Pembayaran
              </h1>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                Lihat Semua
              </span>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="px-5 flex items-center justify-between">
                <div>
                  <h1 className="text-base">BCA Virtual Account</h1>
                  <p className="text-sm font-light text-gray-500">
                    Mudah & terverifikasi otomatis
                  </p>
                </div>
                <input
                  type="radio"
                  id="bca"
                  name="payment"
                  value="BCA"
                  checked={paymentMethod === "BCA"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="px-5 flex items-center justify-between">
                <div>
                  <h1 className="text-base">Mandiri Virtual Account</h1>
                  <p className="text-sm font-light text-gray-500">
                    Tidak perlu upload bukti transfer
                  </p>
                </div>
                <input
                  type="radio"
                  id="mandiri"
                  name="payment"
                  value="Mandiri"
                  checked={paymentMethod === "Mandiri"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="px-5 flex items-center justify-between">
                <div>
                  <h1 className="text-base">BRI Virtual Account</h1>
                  <p className="text-sm font-light text-gray-500">
                    Pembayaran langsung terverifikasi
                  </p>
                </div>
                <input
                  type="radio"
                  id="bri"
                  name="payment"
                  value="BRI"
                  checked={paymentMethod === "BRI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <h1 className="text-base font-semibold text-gray-900">
                Metode Pengiriman
              </h1>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                Lihat Semua
              </span>
            </div>
            <div className="flex flex-col space-y-3 px-4">
              <div className="px-5 py-3 rounded-lg flex items-center justify-between border border-gray-200">
                <div>
                  <h1 className="text-base">JNE Reguler</h1>
                  <p className="text-sm font-light text-gray-500">
                    Minimal 3-4 Hari Sampai
                  </p>
                </div>
                <input
                  type="radio"
                  id="jne-reguler"
                  name="shipping"
                  value="JNE Reguler"
                  checked={shippingMethod === "JNE Reguler"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
              </div>
              <div className="px-5 py-3 rounded-lg flex items-center justify-between border border-gray-200">
                <div>
                  <h1 className="text-base">JNE Express</h1>
                  <p className="text-sm font-light text-gray-500">
                    Cepat dalam hitungan hari
                  </p>
                </div>
                <input
                  type="radio"
                  id="jne-express"
                  name="shipping"
                  value="JNE Express"
                  checked={shippingMethod === "JNE Express"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-10 px-5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-light">Total Tagihan</h1>
                <p className="text-base font-semibold text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-light">Ongkos Kirim</h1>
                <p className="text-base font-semibold text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </p>
              </div>
            </div>
            <div className="px-5 my-5 mt-5">
              <button
                onClick={handlePayment}
                className="bg-yellow-400 text-black font-semibold px-3 py-2 rounded-md w-full"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSection;
