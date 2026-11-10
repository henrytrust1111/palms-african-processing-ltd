export type CompanySection = {
  slug: string;
  title: string;
  slide: string;
  image: string;
  imageAlt: string;
  intro?: string;
  blocks?: {
    title: string;
    body?: string;
    items?: string[];
  }[];
  images?: {
    src: string;
    alt: string;
  }[];
  marketFigures?: {
    value: string;
    label: string;
    caption: string;
  }[];
};

export const companySections: CompanySection[] = [
  {
    slug: "about-us",
    title: "About us",
    slide: "02",
    image: "/assets/company-deck/about-us.jpg",
    imageAlt: "Palm plantation from the About us slide",
    intro:
      "The Palms African Processing Ltd is a company focused on making a positive impact. Our objective is to secure a steady supply of raw materials for vegetable oil factories by offering financing, assistance after harvest, and market access to small-scale farmers.",
  },
  {
    slug: "problem",
    title: "problem",
    slide: "03",
    image: "/assets/company-deck/problem.jpg",
    imageAlt: "Palm fruit cross-section showing kernel and palm oil",
    blocks: [
      {
        title: "ACCESS TO finance",
        body:
          "Smallholder farmers are instrumental in achieving food self-sufficiency, generating employment opportunities, and driving economic growth. However, a major obstacle they face is limited access to financing, which negatively impacts their productivity, particularly in Nigeria and throughout Africa.",
      },
      {
        title: "Poor quality kernels",
        body:
          "Poor quality of kernel can significantly affect the production of palm kernel oil (PKO). Kernel that is not properly processed or stored can contain high levels of impurities, such as dirt and debris, which can negatively impact the quality of the PKO.",
      },
      {
        title: "Loss of revenue",
        body:
          "Furthermore, kernel that is not properly dried can lead to mold growth, which can also negatively impact the quality and yield of PKO. These factors can all contribute to a lower overall production of PKO and decrease the revenue.",
      },
    ],
  },
  {
    slug: "solution",
    title: "solution",
    slide: "04",
    image: "/assets/company-deck/solution-farmers.jpeg",
    imageAlt: "Palm kernels pictured on the solution slide",
    blocks: [
      {
        title: "ACCESS TO finance",
        body:
          "We assist smallholder farmers by providing zero-interest loans (ranging from N1,000 to N500,000). These funds are used to acquire palm fruit. After processing the fruits, the farmers sell the palm oil and offer the kernels to us at a 2% discount from the current market price.",
      },
      {
        title: "Farmer support",
        body:
          "We have provided support to over 17 small-scale farmers through loans and empowerment programs, totaling 2,750,500.00 NGN (approximately 6,037.67 USD).",
      },
      {
        title: "Supply of quality kernel",
        body:
          "High purity of 87% is achieved through innovative filtration and separation processes that eliminate impurities and improve end product purity. Quality control and detailed production process also contribute to maintaining high purity.",
      },
      {
        title: "Increase in revenue",
        body:
          "Supplying vegetable oil factories with top-notch kernel leads to increased profits through:",
        items: [
          "1: Lower downtime & maintenance expenses.",
          "2: Minimized waste: Decreased kernel breakage results in less waste and increased profits.",
        ],
      },
    ],
    images: [
      {
        src: "/assets/company-deck/solution-kernel.png",
        alt: "Palm kernels pictured on the solution slide",
      },
    ],
  },
  {
    slug: "market-size",
    title: "Market SIZE",
    slide: "05",
    image: "/assets/company-deck/market-size.jpg",
    imageAlt: "Palm plantation at sunset from the Market SIZE slide",
    marketFigures: [
      {
        value: "$66.8b",
        label: "Total Available Market",
        caption: "Opportunity to build",
      },
      {
        value: "$11.356b",
        label: "Total Serviceable Market",
        caption: "Freedom to invent",
      },
      {
        value: "$3.45B",
        label: "Obtainable Market",
        caption: "Total Share/Target Market in the next five years",
      },
    ],
  },
  {
    slug: "product-overview",
    title: "Product overview",
    slide: "06",
    image: "/assets/company-deck/product-01.jpg",
    imageAlt: "Product image from the Product overview slide",
    images: [
      { src: "/assets/company-deck/product-01.jpg", alt: "Product image from the Product overview slide" },
      { src: "/assets/company-deck/product-02.jpg", alt: "Product image from the Product overview slide" },
      { src: "/assets/company-deck/product-03.jpg", alt: "Product image from the Product overview slide" },
      { src: "/assets/company-deck/product-04.jpg", alt: "Product image from the Product overview slide" },
      { src: "/assets/company-deck/product-05.jpg", alt: "Product image from the Product overview slide" },
      { src: "/assets/company-deck/product-06.jpg", alt: "Product image from the Product overview slide" },
    ],
  },
  {
    slug: "traction",
    title: "TRACTION",
    slide: "07",
    image: "/assets/company-deck/traction-02.png",
    imageAlt: "Farmers and a tree illustration from the Traction slide",
    blocks: [
      {
        title: "SOFT LOANS / EMPOWERMENT",
        body:
          "We have provided support to over 17 small-scale farmers through loans and empowerment programs, totaling 3,550,500.00 NGN (approximately 6,037.67 USD)",
      },
      {
        title: "Kernels delivered",
        body: "More than 110 metric tons of high-quality kernel have been delivered",
      },
      {
        title: "REVENUE",
        body:
          "In the first year of operation, we generated a turnover of above 44,000,000 NGN (equivalent to 96,549.78 USD)",
      },
      {
        title: "JOB CREATED",
        body: "We have directly and indirectly created more than 20 jobs",
      },
    ],
    images: [
      { src: "/assets/company-deck/traction-01.png", alt: "Traction slide graphic" },
      { src: "/assets/company-deck/traction-03.jpeg", alt: "Traction slide graphic" },
      { src: "/assets/company-deck/traction-04.png", alt: "Traction slide graphic" },
    ],
  },
  {
    slug: "investment-use-of-funds",
    title: "Investment and use of funds",
    slide: "16",
    image: "/assets/company-deck/investment-use-of-funds.jpg",
    imageAlt: "Palm products and plantation from the Investment and use of funds slide",
    intro:
      "We've already invested $10,600.43(4,879,604.00 NG) towards materializing our vision and now aim to raise $50,000 (23,017,000 NG)to achieve the following.",
    blocks: [
      {
        title: "Use of funds",
        items: [
          "1: Machinery Financing",
          "2: ASSET FINANCING",
          "3: Warehousing",
          "4: Recruitment of skilled workers",
          "5: Working capital",
        ],
      },
    ],
  },
];

export const missionLink = {
  title: "Mission",
  href: "/vision-and-values",
};
