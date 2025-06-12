import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "AXIOO HYPE 7 AMD X8 RYZEN 7 6800H - X7 RYZEN 7 5825 16GB 512GB W11 14.0FHD IPS BLIT HDMI - X7-DOS-8/512",
        description:
          "AXIOO HYPE 7 AMD X8 RYZEN 7 6800H 16GB 512GB W11 14.0FHD IPS BLIT HDMI GRY",
        price: 6389000,
        stock: 25,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2025/2/22/63933a36-a26d-41d0-acba-ebe1af085832.jpg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "ASRock H610M-HDV/M.2 DDR4 (Intel LGA 1700, Gen12)",
        description: "ASRock H610M-HDV/M.2 R2.0",
        price: 1079000,
        stock: 30,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/9/26/876abd8d-2b85-4926-b5b9-54ce6a8d652b.jpg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "Apple Macbook Air M2 2022 13,6 inch",
        description: "Garansi Resmi iBox Apple Indonesia - 16/256 GB, Midnight",
        price: 13749000,
        stock: 5,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/9/9/fbc13a48-f451-443d-be76-4c55c3e025f9.jpg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "Apple Macbook Air M3 13 inch 2024",
        description:
          "Garansi Resmi Apple Indonesia iBox - 16/512 GB, Space Gray",
        price: 19749000,
        stock: 9,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/5/30/fb713728-8489-4756-922c-1d42805b3262.jpg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "Monitor LED SKYWORTH H27G30Q 27 IPS 1440p 2K QHD 180Hz 5ms HDMI 2.0 DP 1.4 Adaptive Sync HDR10",
        description:
          "Get ready to elevate your gaming experience to new heights with breathtaking visuals and lightning-fast performance - H27G30Q, Seller",
        price: 2425401,
        stock: 21,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/21fab4354acb405da7de608220debaba~.jpeg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "ADVAN Workplus AMD Ryzen 5 6600H",
        description:
          "14 FHD IPS 16GB/1TB Laptop Notebook Free Windows 11 Upgradeable - 512 GB",
        price: 6541122,
        stock: 32,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/d3bc83704afa4a27bbd61d58cdb071b2~.jpeg.webp?ect=4g",
      },
      {
        userId: "71c56758-5163-4473-9adf-f348e78894a5",
        name: "Lenovo IdeaPad Slim 5 14AHP10",
        description:
          "14 OLED RYZEN 7 8845HS 16GB 512GB W11+OHS 14 WUXGA IPS - 24GB, LAPTOP",
        price: 12799000,
        stock: 24,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2025/3/22/f54512d3-8841-4182-93f7-b1eba8c0c266.jpg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "Macbook Air 2020 M1 13",
        description:
          "8GB 256GB 8 Core CPU 7 Core GPU 256 GB iBox - PROMO - GREY",
        price: 10349000,
        stock: 9,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2024/12/6/38ad4d1f-639d-4bae-800b-4acf7fb135f1.jpg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "ASUS Vivobook 14 A1404VA",
        description: "Deskripsi produk B",
        price: 8499000,
        stock: 14,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/019a24ab5bbb410e9af37ca3fdb0614e~.jpeg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "Apple MacBook Air M3 13",
        description:
          "16/256GB 24/512GB Garansi Resmi Indonesia 1 Tahun Shop Tokopedia - 16/256 GB iBox, Starlight",
        price: 16499000,
        stock: 12,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/9fa7c4b314b04bea834bf284aad4e2e1~.jpeg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "Apple Mac Mini M4",
        description: "Garansi Resmi Apple Indonesia iBox - M4 16/256 GB",
        price: 9499000,
        stock: 32,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2025/2/12/5d35ee78-42e9-4aab-b684-ffa6b1f1284d.jpg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "APPLE Mac Mini M4",
        description:
          "M4 PRO 2024 16GB/24GB RAM 256GB/512GB SSD 10/16-Core GPU Resmi IBOX - PROMO 16/256GB",
        price: 9499000,
        stock: 24,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2025/2/9/50ce4ed0-318f-46ab-a51a-68e96e88a7a7.png.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "Apple iMac M3",
        description:
          "24 inch 8GPU 8CPU 256GB - Garansi Resmi iBox Apple Indo - Green",
        price: 19299000,
        stock: 7,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/8c9d55bdb82b4e8f9caedf88ab1184ce~.jpeg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "HP OmniStudio X 27-CS0116D",
        description:
          "Intel Ultra7-155H 32GB(2x16GB) DDR5 2TB SSD XBOX Game Pass DA ULT 1M &Office 365 Basic+OHS2021 W11 Home Touch 27FHD",
        price: 25199000,
        stock: 14,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/11/19/4b350fe6-4cc4-4076-887f-4ecb2288ef14.jpg.webp?ect=4g",
      },
      {
        userId: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
        name: "SLIM PC / Komputer Rakitan Gen 12 Office Intel Core i3 12100",
        description:
          "i5 12400 / i7 12700 | RAM 16GB DDR4 | SSD M2 NVMe 512GB | Lengkap Siap Pakai - i3-12100, 8GB+256GB NVMe",
        price: 4800000,
        stock: 27,
        imageUrl:
          "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/11/14/50b009f3-5658-4b58-a83f-6fbef8fa0e34.jpg.webp?ect=4g",
      },
    ],
  });
  console.log("Product seed berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
