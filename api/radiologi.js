// utils/api/radiologi.js
import request from "utils/request";

export function getListRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi`,
    method: "GET",
    params,
  });
}

export function getDetailRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/show`,
    method: "GET",
    params,
  });
}

export function searchRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/search`,
    method: "GET",
    params,
  });
}

export function getListOptionRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/list`,
    method: "GET",
    params,
  });
}

// Function to generate examination options
export function generateExaminationOptions() {
  const dummyRadiologiData = [
    {
      namaPemeriksaan: "X-Ray",
      jenisPemeriksaan: "APPENDICOGRAM",
      tarif: 288000,
      persiapanPemeriksaan: [
        "- Pasien minum Barium sulfat (BaSO4) dengan cara: barium di encerkan dengan 1 gelas air putih dan diminum sampai habis.",
        "- Setelah minum barium: Pasien diusahakan tidak muntah, tidak BAB, puasa makan ± 8 jam (hingga pemeriksaan selesai dilakukan).",
      ],
    },
    {
      namaPemeriksaan: "X-Ray",
      jenisPemeriksaan: "HSG",
      tarif: 1100000,
      persiapanPemeriksaan: [
        "- Pemeriksaan HSG dilakukan di hari ke 7-10/sebelum ovulasi dihitung dari awal mulai menstruasi.",
        "- Tidak boleh melakukan hubungan seksual mulai dari hari pertama menstruasi sampai dengan tindakan HSG selesai dilakukan.",
        "- Pasien tidak sedang mengalami radang aktif di area reproduksi (konsultasikan dengan dokter spesialis kandungan terlebih dahulu).",
        "- Pasca pemeriksaan HSG, kemungkinan pasien akan mengalami keputihan/keluarnya darah dari organ reproduksi, siapkan pembalut.",
      ],
    },
    {
      namaPemeriksaan: "USG",
      jenisPemeriksaan: "ABDOMEN",
      tarif: 240000,
      persiapanPemeriksaan: [
        "- Puasa makan 6 jam sebelum pemeriksaan.",
        "- Selama puasa dianjurkan banyak minum air putih.",
        "- 30 menit sebelum pemeriksaan USG, minum ± 3 gelas air putih, lalu tahan kencing.",
      ],
    },
    {
      namaPemeriksaan: "X-Ray",
      jenisPemeriksaan: "BNO",
      tarif: 108000,
      persiapanPemeriksaan: [
        "- Sehari sebelum pemeriksaan, makan makanan lunak yang mudah dicerna dan tidak mengandung serat.",
        "- Minum air putih atau minuman lain yang tidak mengandung alkohol.",
        "- Pukul 22.00 (10 malam) makan malam terakhir, pantang merokok dan aktivitas bicara dikurangi.",
        "- Pukul 04.00 pagi minum obat pencahar/urus-urus (garam inggris 30 gram dilarutkan dalam 1 gelas air putih dan diminum sekaligus).",
        "- Dalam waktu 1 jam, minum air putih/teh/sirup 4-5 gelas dan dilanjutkan puasa makan.",
        "- Setelah tuntas buang air besar dan merasa tidak mulas, datang ke ruang radiologi dalam keadaan puasa (belum makan dan minum).",
      ],
    },

  ];

  return dummyRadiologiData.map(item => ({
    label: `${item.namaPemeriksaan} - ${item.jenisPemeriksaan}`,
    value: item.tarif,
  }));
}
