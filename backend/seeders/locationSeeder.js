import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "../models/locationModel.js"; // Sesuaikan path jika perlu

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const locations = [
  {
    name: "Aceh (NAD)",
    cities: [
      {
        name: "Banda Aceh",
        districts: [
          { name: "Baiturrahman" },
          { name: "Banda Raya" },
          { name: "Banda Sakti" },
          { name: "Jaya Baru" },
          { name: "Kuta Alam" },
          { name: "Kuta Raja" },
          { name: "Lueng Bata" },
          { name: "Meuraxa" },
          { name: "Ulee Kareng" },
        ]
      },
      {
        name: "Langsa",
        districts: [
          { name: "Langsa Barat" },
          { name: "Langsa Kota" },
          { name: "Langsa Lama" },
          { name: "Langsa Baro" },
          { name: "Langsa Timur" },
          { name: "Langsa Barat Laut" },
          { name: "Langsa Timur Laut" }
        ]
      },
      {
        name: "Lhokseumawe",
        districts: [
          { name: "Blang Mangat" },
          { name: "Banda Sakti" },
          { name: "Muara Satu" },
          { name: "Muara Dua" }
        ]
      },
      {
        name: "Sabang",
        districts: [
          { name: "Sukajaya" },
          { name: "Sukaramai" },
          { name: "Kota" },
          { name: "Kota Baru" },
          { name: "Kota Lama" },
          { name: "Kota Tengah" }
        ]
      },
      {
        name: "Subulussalam",
        districts: [
          { name: "Longkib" },
          { name: "Subulussalam" },
          { name: "Sungai Penuh" },
          { name: "Sungai Raya" },
          { name: "Sungai Raya Barat" },
          { name: "Sungai Raya Timur" },
          { name: "Sungai Raya Selatan" },
          { name: "Sungai Raya Utara" }
        ]
      },
      {
        name: "Aceh Barat",
        districts: [
          { name: "Arongan Lambalek" },
          { name: "Johan Pahlawan" },
          { name: "Kaway XVI" },
          { name: "Meureubo" },
          { name: "Panton Reu" },
          { name: "Samatiga" },
          { name: "Sungai Mas" },
          { name: "Woyla" },
          { name: "Woyla Barat" },
          { name: "Woyla Timur" }
        ]
      },
      {
        name: "Aceh Barat Daya",
        districts: [
          { name: "Blangpidie" },
          { name: "Tangan-Tangan" },
          { name: "Setia" },
          { name: "Sukakarya" },
          { name: "Manggeng" },
          { name: "Jeumpa" },
          { name: "Kuala Batee" },
          { name: "Indra Bersinar" },
          { name: "Sungai Mas" },
          { name: "Tamiang Layang" },
          { name: "Babahrot" },
          { name: "Lembah Sabil" },
          { name: "Simpang Kanan" }
        ]
      },
      {
        name: "Aceh Besar",
        districts: [
          { name: "Baitussalam" },
          { name: "Blang Bintang" },
          { name: "Darul Imarah" },
          { name: "Darul Kamal" },
          { name: "Darussalam" },
          { name: "Indrapuri" },
          { name: "Ingin Jaya" },
          { name: "Kota Jantho" },
          { name: "Krueng Barona Jaya" },
          { name: "Kuta Baro" },
          { name: "Kuta Malaka" },
          { name: "Leupung" },
          { name: "Lhoong" },
          { name: "Mesjid Raya" },
          { name: "Montasik" },
          { name: "Peukan Bada" },
          { name: "Pulo Aceh" },
          { name: "Seulimeum" },
          { name: "Simpang Tiga" },
          { name: "Suka Makmur" }
        ]
      },
      {
        name: "Aceh Timur",
        districts: [
          { name: "Idi Rayeuk" },
          { name: "Idi Tunong" },
          { name: "Darul Aman" },
          { name: "Darul Ihsan" },
          { name: "Idi Cut" },
          { name: "Peureulak" },
          { name: "Peureulak Barat" },
          { name: "Rantau Selamat" },
          { name: "Simpang Ulim" },
          { name: "Sungai Raya" },
          { name: "Pante Bidari" },
          { name: "Paya Bakong" },
          { name: "Madat" },
          { name: "Bendahara" },
          { name: "Nurussalam" },
          { name: "Serba Jadi" },
          { name: "Langkahan" },
          { name: "Julok" },
          { name: "Birem Bayeun" },
          { name: "Peudawa" }
        ]
      },
      {
        name: "Aceh Utara",
        districts: [
          { name: "Baktiya" },
          { name: "Baktiya Barat" },
          { name: "Banda Baro" },
          { name: "Cot Girek" },
          { name: "Dewantara" },
          { name: "Geuredong Pase" },
          { name: "Kuta Makmur" },
          { name: "Langkahan" },
          { name: "Lapang" },
          { name: "Lhoksukon" },
          { name: "Matangkuli" },
          { name: "Meurah Mulia" },
          { name: "Muara Batu" },
          { name: "Nibong" },
          { name: "Nisam" },
          { name: "Nisam Antara" },
          { name: "Paya Bakong" },
          { name: "Pirak Timur" },
          { name: "Samudera" },
          { name: "Sawang" },
          { name: "Seunuddon" },
          { name: "Simpang Keuramat" },
          { name: "Syamtalira Aron" },
          { name: "Syamtalira Bayu" },
          { name: "Tanah Jambo Aye" },
          { name: "Tanah Luas" },
          { name: "Tanah Pasir" }
        ]
      }
    ]
  }
];

// Koneksi menggunakan MONGO_URI dari environment
mongoose.connect(MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected");
  await Location.deleteMany();
  await Location.insertMany(locations);
  console.log("✅ Location seeding completed");
  process.exit();
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});
