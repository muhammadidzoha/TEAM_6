import React from "react";
import { getAllProducts } from "../../lib/products_service_api";
import useSWR from "swr";
import { Link } from "react-router-dom";

const ProductSection = ({ updateCart }) => {
  const products = async () => {
    return await getAllProducts();
  };

  const { data } = useSWR("products", products);
  if (!data) return <div>Loading...</div>;

  const addToCart = (product) => {
    // Ambil data keranjang dari localStorage
    const cartData = JSON.parse(localStorage.getItem("cart")) || {
      count: 0,
      product: [],
    };

    // Periksa apakah produk sudah ada di keranjang
    const existingProductIndex = cartData.product.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      // Jika produk sudah ada, tambahkan totalnya
      cartData.product[existingProductIndex].total += 1;
    } else {
      // Jika produk belum ada, tambahkan produk baru dengan total 1
      cartData.product.push({
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        total: 1,
      });
    }

    // Perbarui count berdasarkan jumlah total produk
    cartData.count = cartData.product.reduce(
      (acc, item) => acc + item.total,
      0
    );

    // Simpan kembali data ke localStorage
    localStorage.setItem("cart", JSON.stringify(cartData));

    updateCart();
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Cheapest Products
        </h2>
        <Link to={"/products"} className="hover:underline">
          Selengkapnya
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {data.map((product) => (
          <div key={product.id} className="group relative">
            <img
              alt={product.id}
              src={product.image}
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-25 lg:aspect-auto lg:h-80"
            />
            <div className="mt-4">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-700">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.description}
                </h3>
              </div>
              <div>
                <h3 className="text-sm text-gray-700">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.stock} unit
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                  {product.seller_name}
                </span>
                <button
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 font-medium cursor-pointer z-10"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
