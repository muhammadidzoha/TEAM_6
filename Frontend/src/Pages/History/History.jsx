import React from "react";
import { getHistory } from "../../lib/history_service_api";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["Transaction", "Amount", "Date", "Status", "Account", ""];

const History = () => {
  const navigate = useNavigate();

  const historys = async () => {
    return await getHistory();
  };

  const { data } = useSWR("history", historys);
  if (!data) return <div>Loading...</div>;

  console.log(data);

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
        <div className="bg-white rounded-sm w-full h-max">
          <section>
            <div className="mb-4 p-5 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h5>Recent Transactions</h5>
                <p className="mt-1 font-normal">
                  These are details about the last transactions
                </p>
              </div>
            </div>
          </section>
          <section className="overflow-scroll px-4">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
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
                  <tr key={`${h.payment_id}-${index}`} className="border-b">
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={h.product_image}
                        alt={h.product_name}
                        className="w-12 h-12 object-cover rounded-md"
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
                      {new Date(h.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">{h.payment_status}</td>
                    <td className="p-4">{h.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default History;
