import React from "react";
import useSWR from "swr";
import axios from "axios";

const TABLE_HEAD = ["Transaction", "Amount", "Date", "Status", "Account", ""];

const HISTORY_SERVICE_URL = import.meta.env.VITE_HISTORY_SERVICE_URL;

const HistorySection = () => {
  const fetchHistory = async () => {
    try {
      const query = `
        query GetPaymentHistories {
          paymentHistories {
            id
            order_id
            user_id
            amount
            payment_method
            payment_status
            created_at
            products {
              id
              name
              description
              image
            }
          }
        }
      `;

      const response = await axios.post(HISTORY_SERVICE_URL, {
        query,
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const data = response.data.data.paymentHistories;

      // Transform data untuk kompatibilitas dengan komponen
      return data.map((history) => ({
        payment_id: history.id,
        amount: history.amount,
        created_at: history.created_at,
        payment_status: history.payment_status,
        payment_method: history.payment_method,
        // Ambil produk pertama jika ada
        product_name: history.products[0]?.name || "Unknown Product",
        product_description: history.products[0]?.description || "",
        product_image: history.products[0]?.image || "/placeholder-image.jpg",
      }));
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw error;
    }
  };

  const { data, error, isLoading } = useSWR("history", fetchHistory);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!data) return <div className="text-center py-10">No data available</div>;

  console.log(data);

  return (
    <div>
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-white rounded-sm w-full h-max">
          <section>
            <div className="mb-4 p-5 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h5 className="text-xl font-semibold">Recent Transactions</h5>
                <p className="mt-1 font-normal text-gray-600">
                  These are details about the last transactions
                </p>
              </div>
            </div>
          </section>
          <section className="overflow-scroll px-4">
            {data && data.length > 0 ? (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-gray-200 bg-gray-50 p-4"
                      >
                        <span className="font-normal leading-none opacity-70">
                          {head}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((h, index) => (
                    <tr
                      key={`${h.payment_id}-${index}`}
                      className="border-b border-gray-200"
                    >
                      <td className="p-4 flex items-center gap-4">
                        <img
                          src={h.product_image}
                          alt={h.product_name}
                          className="w-12 h-12 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div>
                          <p className="font-semibold">{h.product_name}</p>
                          <p className="text-sm text-gray-500">
                            {h.product_description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(h.amount)}
                      </td>
                      <td className="p-4">
                        {new Date(h.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            h.payment_status === "completed"
                              ? "bg-green-100 text-green-800"
                              : h.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {h.payment_status}
                        </span>
                      </td>
                      <td className="p-4">{h.payment_method}</td>
                      <td className="p-4">
                        {/* Actions column - bisa ditambahkan tombol detail, dll */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada riwayat transaksi
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
