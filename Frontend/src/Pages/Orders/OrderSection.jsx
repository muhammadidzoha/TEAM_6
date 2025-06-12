import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrdersByUser } from "../../lib/order_service_api";
import useSWR from "swr";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { processPayment } from "../../lib/payment_service_api";
import axios from "axios";

const OrderSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const orders = async () => {
    return await getOrdersByUser(id);
  };

  const { data } = useSWR(`orders-${id}`, orders);
  if (!data) return <div>Loading...</div>;

  const indexTerakhir = data.length - 1;

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Silakan pilih metode pembayaran.", {
        autoClose: 500,
      });
      return;
    }

    try {
      const paymentData = {
        order_id: parseInt(data[indexTerakhir].id),
        amount: parseFloat(data[indexTerakhir].total_price),
        payment_method: paymentMethod,
      };

      const historyData = {
        order_id: parseInt(data[indexTerakhir].id),
        user_id: parseInt(id),
        amount: parseFloat(data[indexTerakhir].total_price),
        payment_method: paymentMethod,
        payment_status: "completed",
      };

      const response = await processPayment(paymentData);
      await axios.post("http://localhost:5005/history", historyData);
      toast.success(response.message, {
        pauseOnFocusLoss: false,
        autoClose: 1500,
        pauseOnHover: false,
        onClose: () => {
          localStorage.removeItem("cart");
          navigate("/");
          window.location.reload();
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Terjadi kesalahan.", {
        autoClose: 1500,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      });
    }
  };

  return (
    <div>
      <div className="p-2 font-display bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="font-semibold tracking-wider text-2xl">TEAM 6</h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Payment
        </h2>
        <div className="flex gap-[50px] relative mt-5">
          <div className="flex flex-col space-y-5 w-[70%]">
            <div className="bg-white p-5 rounded-lg">
              <h1 className="uppercase text-sm font-semibold text-obito-text-secondary">
                Alamat Pengiriman
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1 mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <div className="flex items-center text-sm font-semibold space-x-1">
                      <h1>Rumah</h1>
                      <p>•</p>
                      <span>DefaultUser</span>
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
            {data[indexTerakhir]?.items &&
            data[indexTerakhir].items.length > 0 ? (
              data[indexTerakhir].items.map((item, index) => (
                <div key={item.order_id} className="bg-white p-5 rounded-lg">
                  <h1 className="uppercase text-sm font-semibold text-obito-text-secondary">
                    Pesanan {index + 1}
                  </h1>
                  <div className="flex items-start gap-4 mt-3">
                    {/* Gambar Produk */}
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    {/* Detail Produk */}
                    <div className="flex flex-col space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-light text-gray-900">
                          {item.product_name}
                        </h2>
                        <div className="flex space-x-0.5">
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">{item.quantity}</span>
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
                        {item.product_description}
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
          <div className="sticky top-0 bg-white rounded-sm w-[30%] h-max">
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
                  name="bca"
                  value="BCA"
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
                  name="mandiri"
                  value="Mandiri"
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
                  name="bri"
                  value="BRI"
                  onChange={(e) => setPaymentMethod(e.target.value)}
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
                  }).format(data[indexTerakhir].total_price)}
                </p>
              </div>
            </div>
            <div className="px-5 my-5">
              <button
                onClick={handlePayment}
                className="bg-indigo-600 text-white px-3 py-2 rounded-md w-full"
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
