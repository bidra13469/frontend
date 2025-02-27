"use client";
import React from "react";
import SwiperSliderCom from "@/components/Helper/SwiperSliderCom";
import Link from "next/link";
import StringLang from "@/utilities/StringLang";

function Hero({ datas }) {
  if (datas && datas.length > 0) {
    return (
      <div className="w-full relative main-hero-slider">
        <SwiperSliderCom
          dotsLabel="swiper-pagination"
          options={{
            speed: 1000,
            autoplay: {
              delay: 3000,
            },
            effect: "fade",
            slidesPerView: 1,
          }}
        >
          {datas.map((slider, i) => (
            <div
              key={i}
              className="w-full xl:h-[470px] h-[300px] flex items-center relative"
            >
              <Link target="_blank" href={slider.link}>
                <img
                  src={process.env.BASE_URL + slider.image}
                  alt="hero"
                  className="w-full h-full absolute left-0 top-0 object-cover transform rtl:-scale-x-[1] scale-x-100"
                />
              </Link>
              <div className="w-full">
                <div className="theme-container mx-auto relative z-10">
                  <p className="xl:text-2xl text-sm font-medium text-white">
                    {slider.title || "20% Off Get Unlimited Offer"}
                  </p>
                  <h1 className="text-white xl:text-[54px] font-medium tracking-wide xl:leading-[64px] xl:w-[610px] text-3xl mb-10 line-clamp-2">
                    {slider.sub_title ||
                      "Unlock surprise game keys at great prices"}
                  </h1>
                  <div>
                    <Link target="_blank" href={slider.link}>
                      <div className="lg:py-4 lg:px-[25px] py-3 px-5 inline-flex rtl:space-x-reverse space-x-2.5 items-center bg-primary-blue  hover:bg-white hover:text-black  group common-transition rounded-[5px] hover:text-black text-primary-black">
                        <span className="text-primary-black  common-transition group-hover:text-black text-base font-medium leading-5">
                          <StringLang string="Grab The Offer" />
                        </span>
                        <span>
                          <svg
                            width="21"
                            height="14"
                            viewBox="0 0 21 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="rtl:rotate-180"
                          >
                            <path
                              d="M17.6701 6.19402C17.5805 6.19402 17.4968 6.19402 17.4072 6.19402C11.9868 6.19402 6.56652 6.19402 1.14621 6.19402C1.00278 6.19402 0.859353 6.18894 0.721903 6.21941C0.273696 6.30574 -0.0430371 6.69167 0.00477159 7.07253C0.0585564 7.48894 0.423098 7.78855 0.901186 7.81394C0.996803 7.81902 1.09242 7.81902 1.19401 7.81902C6.5964 7.81902 12.0048 7.81902 17.4072 7.81902C17.4968 7.81902 17.5805 7.81902 17.7299 7.81902C17.6343 7.90535 17.5805 7.95613 17.5207 8.00691C15.9311 9.36277 14.3354 10.7186 12.7458 12.0745C12.3514 12.4096 12.3096 12.8718 12.6442 13.2069C12.9789 13.5471 13.5586 13.5979 13.9709 13.3237C14.0366 13.2831 14.0904 13.2323 14.1502 13.1815C16.3076 11.3483 18.4649 9.51004 20.6163 7.67175C21.1362 7.22996 21.1362 6.78816 20.6163 6.34636C18.447 4.49793 16.2717 2.64949 14.1024 0.795971C13.8155 0.552222 13.4928 0.435425 13.0924 0.531909C12.4351 0.689331 12.1841 1.3698 12.6084 1.81668C12.6621 1.87761 12.7279 1.92839 12.7936 1.98425C14.3713 3.32488 15.943 4.67058 17.5267 6.01121C17.5864 6.06199 17.6641 6.08738 17.7299 6.128C17.706 6.14324 17.688 6.16863 17.6701 6.19402Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SwiperSliderCom>
      </div>
    );
  }
}

export default Hero;
