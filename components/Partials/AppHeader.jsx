"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useLazyLogoutQuery } from "@/store/features/auth/apiSlice";
import { useLazyGetCartQuery } from "@/store/features/cart/apiSlice";
import { useSelector } from "react-redux";
import StringLang from "@/utilities/StringLang";
import DropDown from "../Helper/DropDown";
import { useDispatch } from "react-redux";
import { changeCurrency } from "@/store/features/setup/setupSlice";
import { getCookie, hasCookie, setCookie } from "cookies-next";

function AppHeader({ settings, categories, languages, currencies }) {
  const authProfile = useSelector((state) => state.auth.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const seller_approval = searchParams.get("seller_approval");
  const message = searchParams.get("message");
  const pathname = usePathname();
  const [logout, { isLoading, isSuccess }] = useLazyLogoutQuery();
  useEffect(() => {
    if (!!verified) {
      router.push("/");
    }
    if (verified === "yes") {
      toast.success(message);
    }
    if (verified === "no") {
      toast.error(message);
    }
  }, [verified]);
  useEffect(() => {
    if (!!seller_approval) {
      router.push("/");
    }
    if (seller_approval === "yes") {
      logout();
      toast.success(message);
    }
    if (seller_approval === "no") {
      toast.error(message);
    }
  }, [seller_approval]);
  const [searchKey, setSearchkey] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("category");
  const [categoryToggle, setCategoryToggle] = useState(false);
  useEffect(() => {
    setCategoryToggle(false);
  }, [pathname, searchParams]);
  const auth = useSelector((state) => state.auth.accessToken);
  const [getCartData, { data }] = useLazyGetCartQuery();

  useEffect(() => {
    if (!!auth) {
      getCartData();
    }
  }, [auth]);
  // currency
  const dispatch = useDispatch();
  const changeCurrencyHandler = (value) => {
    dispatch(changeCurrency(value));
  };
  // translate
  const [selectedLanguage, setLanguage] = useState(
    languages && languages.length > 0 ? languages[0] : null
  );
  useEffect(() => {
    let addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "auto",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  const setCookieHandlerAction = (lang_code) => {
    const currentDomain = window.location.hostname;
    const isSubdomain = currentDomain.split(".").length >= 2;
    const cookieDomain = isSubdomain ? `.${currentDomain}` : currentDomain;
    setCookie("googtrans", `/auto/${lang_code}`, {
      path: "/",
      domain: `${cookieDomain}`,
      secure: false,
    });
    if (currentDomain !== "localhost") {
      deleteCookie("googtrans", `${currentDomain}`);
      if (currentDomain.split(".").length === 3) {
        const dotDomain = currentDomain.split(".").slice(1, 3).join(".");
        setCookie("googtrans", `/auto/${lang_code}`, {
          path: "/",
          domain: `${dotDomain}`,
          secure: false,
        });
      }
    }
  };

  useEffect(() => {
    if (languages && languages.length > 0) {
      if (hasCookie("googtrans")) {
        const getCode = getCookie("googtrans").replace("/auto/", "");
        const findItem = languages.find((item) => item.lang_code === getCode);
        setLanguage(findItem);
        if (getCode === "ar" || getCode === "he") {
          document.body.setAttribute("dir", "rtl");
        } else {
          document.body.setAttribute("dir", "ltr");
        }
      } else {
        setLanguage(languages[0]);
        if (
          languages[0].lang_code === "ar" ||
          languages[0].lang_code === "he"
        ) {
          document.body.setAttribute("dir", "rtl");
        } else {
          document.body.setAttribute("dir", "ltr");
        }
      }
    }
  }, [languages]);

  const langChange = (value) => {
    setCookieHandlerAction(value.lang_code);
    setLanguage(value);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <div className="w-full bg-black lg:block hidden">
        <div className="w-full border-b border-primary-border">
          <div className="theme-container mx-auto h-[80px]">
            <div className="flex justify-between items-center h-full">
              <div className="flex justify-between max-w-[740px] w-full">
                <div>
                  <Link href="/">
                    <img
                      src={process.env.BASE_URL + settings.logo}
                      alt=""
                      className="w-[133px] object-contain h-[38px]"
                    />
                  </Link>
                </div>
                <div className="2xl:w-[462px] relative">
                  <input
                    value={searchKey}
                    onChange={(e) => setSearchkey(e.target.value)}
                    placeholder="Search your products..."
                    className="h-[52px] rounded ltr:pl-[22px] ltr:pr-[100px] rtl:pr-[22px] rtl:pl-[100px] bg-[#0B0E12] border border-[#23262B] focus:outline-0 text-white w-full placeholder:text-sm"
                    type="text"
                  />
                  <Link href={`/products?search=${searchKey}`}>
                    <div className="w-[90px] h-[42px] rounded flex justify-center items-center bg-primary-yellow group hover:bg-white hover:text-black common-transition absolute top-1.5 right-2 rtl:right-auto rtl:left-2">
                      <span className="text-sm font-semibold text-primary-black common-transition group-hover:text-black">
                        <StringLang string="Search" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex rtl:space-x-reverse space-x-5 items-center">
                <div>
                  <Link href="/auth/profile/favorites">
                    <span>
                      <svg
                        width="22"
                        height="20"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 4.50005C17.1045 4.50005 18 5.39548 18 6.50005M11 3.70259L11.6851 3.00005C13.816 0.814763 17.2709 0.814761 19.4018 3.00005C21.4755 5.12665 21.5392 8.55385 19.5461 10.76L13.8197 17.0982C12.2984 18.782 9.70154 18.782 8.18026 17.0982L2.45393 10.76C0.460783 8.55388 0.5245 5.12667 2.5982 3.00007C4.72912 0.814774 8.18404 0.814776 10.315 3.00007L11 3.70259Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
                <div>
                  <Link href="/cart">
                    <span className="relative">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 4H18C20.2091 4 22 5.79086 22 8V13C22 15.2091 20.2091 17 18 17H10C7.79086 17 6 15.2091 6 13V4ZM6 4C6 2.89543 5.10457 2 4 2H2"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 20.5C11 21.3284 10.3284 22 9.5 22C8.67157 22 8 21.3284 8 20.5C8 19.6716 8.67157 19 9.5 19C10.3284 19 11 19.6716 11 20.5Z"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 20.5C20 21.3284 19.3284 22 18.5 22C17.6716 22 17 21.3284 17 20.5C17 19.6716 17.6716 19 18.5 19C19.3284 19 20 19.6716 20 20.5Z"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M11 12C13.3561 13.3404 14.6476 13.3263 17 12"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="absolute left-[13px] -top-[6px] w-[13px] h-[13px] flex justify-center items-center text-black bg-[#FFB321] rounded-full text-[8px]">
                        {data?.items?.length || 0}
                      </span>
                    </span>
                  </Link>
                </div>
                {authProfile ? (
                  <a href="/auth/profile">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-blue">
                      <img
                        src={process.env.BASE_URL + authProfile.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                ) : (
                  <div>
                    <a
                      href="/auth/signin"
                      className="w-8 h-8 flex justify-center items-center"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse
                          cx="14"
                          cy="20.4167"
                          rx="8.16667"
                          ry="4.08333"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="14"
                          cy="8.16667"
                          r="4.66667"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="theme-container mx-auto h-[67px]">
          <div className="w-full flex justify-between items-center h-full">
            <div className="flex gap-[70px] items-center">
              <div className="w-[270px] h-full flex items-center relative">
                <button
                  onClick={() => setCategoryToggle(!categoryToggle)}
                  type="button"
                  className="flex justify-between py-3 px-[18px] h-fit bg-[#23262B] w-full items-center rounded-md"
                >
                  <div className="flex rtl:space-x-reverse space-x-3 items-center">
                    <span>
                      <svg
                        width="14"
                        height="9"
                        viewBox="0 0 14 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="14" height="1" fill="white" />
                        <rect y="8" width="14" height="1" fill="white" />
                        <rect y="4" width="10" height="1" fill="white" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-white tracking-wider">
                      <StringLang string="All Categories" />
                    </span>
                  </div>
                  <div>
                    <svg
                      width="9"
                      height="5"
                      viewBox="0 0 9 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.18359"
                        y="0.910156"
                        width="5.78538"
                        height="1.28564"
                        transform="rotate(135 8.18359 0.910156)"
                        fill="white"
                      />
                      <rect
                        x="4.08984"
                        y="5"
                        width="5.78538"
                        height="1.28564"
                        transform="rotate(-135 4.08984 5)"
                        fill="white"
                      />
                    </svg>
                  </div>
                </button>
                {categoryToggle && (
                  <div
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.14) 0px 15px 50px 0px",
                    }}
                    data-aos="fade-up"
                    className="w-full absolute left-0 top-full bg-black z-20"
                  >
                    {categories && categories.length > 0 ? (
                      <ul className="categories-list relative">
                        {categories.map((item, i) => (
                          <li
                            key={i}
                            className="category-item transition-all duration-300 ease-in-out"
                          >
                            <Link href={`/products?category=${item.slug}`}>
                              <div className="flex justify-between items-center px-5 h-10 cursor-pointer hover:bg-[#0b0e12] text-white">
                                <div className="flex items-center rtl:space-x-reverse space-x-6">
                                  <span className="icon">
                                    <img
                                      src={process.env.BASE_URL + item.icon}
                                      alt=""
                                      className="w-6 h-6 object-contain"
                                    />
                                  </span>
                                  <span className="">{item.name}</span>
                                </div>
                                <div>
                                  <span className="icon-arrow">
                                    <svg
                                      width="6"
                                      height="9"
                                      viewBox="0 0 6 9"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="fill-current rtl:rotate-180"
                                    >
                                      <rect
                                        x="1.49805"
                                        y="0.818359"
                                        width="5.78538"
                                        height="1.28564"
                                        transform="rotate(45 1.49805 0.818359)"
                                      />
                                      <rect
                                        x="5.58984"
                                        y="4.90918"
                                        width="5.78538"
                                        height="1.28564"
                                        transform="rotate(135 5.58984 4.90918)"
                                      />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="w-full flex justify-center items-center mt-5">
                        <span className="text-sm text-primary-black">
                          <StringLang string="No Category Found" />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <nav>
                <ul className="flex rtl:space-x-reverse space-x-[50px] items-center">
                  <li>
                    <Link href="/products" className="text-base font-medium text-white">
                      <StringLang string="Shops" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs" className="text-base font-medium text-white">
                      <StringLang string="Blogs" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-base font-medium text-white">
                      <StringLang string="About" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base font-medium text-white">
                      <StringLang string="Contact" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <Link href="/auth/become-seller">
              <div className="lg:px-5 lg:py-2.5 px-1.5 py-1 rounded-[5px] bg-primary-yellow group hover:bg-white hover:text-black common-transition">
                <span className="text-base font-semibold text-primary-black common-transition group-hover:text-black">
                  <StringLang string="Become a Seller" />
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="lg:hidden block w-full bg-black px-5 py-2 mb-2">
          <div className="flex flex-col space-y-3.5">
            <div className="w-full h-full flex justify-between items-center">
              <div className="w-[150px] h-full flex justify-start items-center relative">
                <Link href="/">
                  <img src={process.env.BASE_URL + settings.logo} alt="" />
                </Link>
              </div>
              <div className="flex rtl:space-x-reverse space-x-5 items-center">
                <div>
                  <Link href="/auth/profile/favorites">
                    <span>
                      <svg
                        width="22"
                        height="20"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 4.50005C17.1045 4.50005 18 5.39548 18 6.50005M11 3.70259L11.6851 3.00005C13.816 0.814763 17.2709 0.814761 19.4018 3.00005C21.4755 5.12665 21.5392 8.55385 19.5461 10.76L13.8197 17.0982C12.2984 18.782 9.70154 18.782 8.18026 17.0982L2.45393 10.76C0.460783 8.55388 0.5245 5.12667 2.5982 3.00007C4.72912 0.814774 8.18404 0.814776 10.315 3.00007L11 3.70259Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
                <div>
                  <Link href="/cart">
                    <span className="relative">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 4H18C20.2091 4 22 5.79086 22 8V13C22 15.2091 20.2091 17 18 17H10C7.79086 17 6 15.2091 6 13V4ZM6 4C6 2.89543 5.10457 2 4 2H2"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 20.5C11 21.3284 10.3284 22 9.5 22C8.67157 22 8 21.3284 8 20.5C8 19.6716 8.67157 19 9.5 19C10.3284 19 11 19.6716 11 20.5Z"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 20.5C20 21.3284 19.3284 22 18.5 22C17.6716 22 17 21.3284 17 20.5C17 19.6716 17.6716 19 18.5 19C19.3284 19 20 19.6716 20 20.5Z"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M11 12C13.3561 13.3404 14.6476 13.3263 17 12"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="absolute left-[13px] -top-[6px] w-[13px] h-[13px] flex justify-center items-center text-black bg-[#FFB321] rounded-full text-[8px]">
                        {data?.items?.length || 0}
                      </span>
                    </span>
                  </Link>
                </div>
                <div>
                  <a
                    href="/auth/profile"
                    className="w-8 h-8 flex justify-center items-center"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="14"
                        cy="20.4167"
                        rx="8.16667"
                        ry="4.08333"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="14"
                        cy="8.16667"
                        r="4.66667"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full flex rtl:space-x-reverse space-x-5 items-center">
              <div className="w-[44px] h-[44px] flex justify-center items-center rounded-lg bg-[#0B0E12] border border-[#23262B]">
                <div onClick={() => setOpen(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-blue"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <input
                  value={searchKey}
                  onChange={(e) => setSearchkey(e.target.value)}
                  placeholder="Search your products..."
                  className="h-[44px] rounded ltr:pl-[22px] ltr:pr-[100px] rtl:pr-[22px] rtl:pl-[100px] bg-[#0B0E12] border border-[#23262B] focus:outline-0 text-white w-full placeholder:text-sm"
                  type="text"
                />
                <Link href={`/products?search=${searchKey}`}>
                  <div className="w-[90px] h-[32px] rounded flex justify-center items-center bg-primary-yellow group hover:bg-white hover:text-black common-transition absolute ltr:right-2 ltr:left-auto rtl:left-2 rtl:right-auto top-1.5">
                    <span className="text-sm font-semibold text-primary-black common-transition group-hover:text-black">
                      <StringLang string="Search" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full mt-5 px-5 flex items-center rtl:space-x-reverse space-x-3">
            <span
              onClick={() => setTab("category")}
              className={`text-base font-semibold ${
                tab === "category" ? "text-primary-blue" : "text-white"
              }`}
            >
              <StringLang string="Categories" />
            </span>
            <span className="w-[1px] h-[14px] bg-[#23262B]"></span>
            <span
              onClick={() => setTab("menu")}
              className={`text-base font-semibold ${
                tab === "menu" ? "text-primary-blue" : "text-white"
              }`}
            >
              <StringLang string="Main Menu" />
            </span>
          </div>
          {tab === "category" ? (
            <div className="category-item mt-5 w-full">
              {categories && categories.length > 0 ? (
                <ul className="categories-list">
                  {categories.map((item, i) => (
                    <li key={i} className="category-item">
                      <Link href={`/products?category=${item.slug}`}>
                        <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center rtl:space-x-reverse space-x-6">
                            <span>
                              <img
                                src={process.env.BASE_URL + item.icon}
                                alt=""
                                className="w-6 h-6 object-contain"
                              />
                            </span>
                            <span className="text-sm font-400 capitalize">
                              {item.name}
                            </span>
                          </div>
                          <div>
                            <span>
                              <svg
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="#1D1D1D"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="w-full flex justify-center items-center mt-5">
                  <span className="text-sm text-primary-black">
                    <StringLang string="No Category Found" />
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="menu-item mt-5 w-full">
              <ul className="categories-list">
                <li className="category-item">
                  <Link href="/products">
                    <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center rtl:space-x-reverse space-x-6">
                        <span className="text-sm font-400 capitalize">
                          <StringLang string="Shops" />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/about">
                    <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center rtl:space-x-reverse space-x-6">
                        <span className="text-sm font-400 capitalize">
                          <StringLang string="About" />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/contact">
                    <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center rtl:space-x-reverse space-x-6">
                        <span className="text-sm font-400 capitalize">
                          <StringLang string="Contact" />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/blogs">
                    <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center rtl:space-x-reverse space-x-6">
                        <span className="text-sm font-400 capitalize">
                          <StringLang string="Blogs" />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/auth/become-seller">
                    <div className="flex justify-between items-center px-5 h-12 transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center rtl:space-x-reverse space-x-6">
                        <span className="text-sm font-400 capitalize">
                          <StringLang string="Become a Seller" />
                        </span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="flex space-x-7 rtl:space-x-reverse px-5 mt-5 mb-4">
            <div className="rtl:space-x-reverse space-x-9 items-center flex notranslate">
              <DropDown
                width={150}
                action={changeCurrencyHandler}
                datas={
                  currencies && currencies.length > 0
                    ? currencies
                        .map((currency) => ({
                          ...currency,
                          name: currency.currency_name,
                        }))
                        .sort(
                          (aDefault, bDefault) => aDefault !== bDefault && 1
                        )
                    : []
                }
              >
                {({ item }) => (
                  <div className="flex rtl:space-x-reverse space-x-[6px] items-center">
                    <span className="text-base text-white font-medium">
                      {item.name}
                    </span>
                    <span>
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="9.00391"
                          y="1"
                          width="6.36242"
                          height="1.41387"
                          transform="rotate(135 9.00391 1)"
                          fill="white"
                        />
                        <rect
                          x="4.5"
                          y="5.5"
                          width="6.36242"
                          height="1.41387"
                          transform="rotate(-135 4.5 5.5)"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </DropDown>
            </div>
            <div className="rtl:space-x-reverse space-x-9 items-center flex notranslate">
              <DropDown
                width={150}
                action={langChange}
                datas={
                  languages && languages.length > 0
                    ? languages.map((item) => ({
                        ...item,
                        name: item.lang_name,
                      }))
                    : []
                }
                position="right"
              >
                {({ item }) => (
                  <div className="flex rtl:space-x-reverse space-x-[6px] items-center">
                    <span className="text-base text-white font-medium">
                      {selectedLanguage
                        ? selectedLanguage.lang_name
                        : item.name}
                    </span>
                    <span>
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="9.00391"
                          y="1"
                          width="6.36242"
                          height="1.41387"
                          transform="rotate(135 9.00391 1)"
                          fill="white"
                        />
                        <rect
                          x="4.5"
                          y="5.5"
                          width="6.36242"
                          height="1.41387"
                          transform="rotate(-135 4.5 5.5)"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </DropDown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppHeader;
