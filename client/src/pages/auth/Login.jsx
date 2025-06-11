import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const query = `
      mutation login($data: LoginUser!) {
        loginUser(data: $data) {
          user {
            id
            name
          addresses {
            id
            street
            BuildingNumber
            RT
            RW
            village
            subDistrict
            district
            regency
            city
            province
            postalCode
          }
        }
          message
        }
      }
    `;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(
        async () =>
          await axios.post(import.meta.env.VITE_USER_SERVICE_URL, {
            query,
            variables: { data: values },
          })
      ),
      {
        pending: "Logging in...",
        success: {
          render({ data }) {
            const user = data?.data?.data?.loginUser?.user;
            const message = data?.data?.data?.loginUser?.message;

            if (user) {
              localStorage.setItem("user", JSON.stringify(user));
              return message;
            }

            return "Login unsuccessful. Please try again.";
          },
          onClose: () => {
            navigate("/");
          },
        },
        error: {
          render({ data }) {
            if (data.response?.data?.errors?.[0]?.message) {
              return data.response.data.errors[0].message;
            }
          },
        },
      }
    );
  };

  const { handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: handleLogin,
  });

  return (
    <div className="max-w-sm w-full mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-4 absolute left-2.5 top-2.5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>

      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-gray-800">Login</h1>
        </div>

        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-y-4">
              <div>
                <label htmlFor="username" className="block text-sm mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-yellow-400 focus:ring-yellow-400 disabled:opacity-50 disabled:pointer-events-none"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <label htmlFor="password" className="block text-sm mb-2">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-yellow-500 focus:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-hidden focus:bg-yellow-500 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
