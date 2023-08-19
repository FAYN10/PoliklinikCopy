// formPersiapanPemeriksaan.js

import React, { useState } from 'react';

const FormPersiapanPemeriksaan = ({ namaPemeriksaan }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };
    console.log('Nama Pemeriksaan:', namaPemeriksaan);

  const renderChecklist = (items) => {
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                name={`check_${index}`}
                checked={checkedItems[`check_${index}`] || false}
                onChange={handleCheckboxChange}
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
    );
  };

  const APPENDICOGRAM = ["Pasien minum Barium Sulfat (BaSO4)"];
  const USG_ABDOMEN = [
    "Puasa makan 6 jam sebelum pemeriksaan",
    "Selama puasa dianjurkan banyak minum air putih",
    "30 menit sebelum pemeriksaan USG minum ± 3 gelas air putih, lalu tahan kencing",
  ];
  const HSG = [
    "Pemeriksaan HSG dilakukan di hari ke 7- 10/ sebelum ovulasi dihitung dari awal mulai menstruasi, Pada fase ini endometrium lebih tipis sehingga akan memberikan gambaran yang lebih jelas dan untuk memastikan pasien tidak hamil.",
    "Tidak boleh melakukan hubungan sexual mulai dari hari pertama menstruasi sampai dengan Tindakan HSG selesai dilakukan.",
    "Pasien tidak sedang mengalami radang aktif di area reproduksi (konsultasikan dengan dokter spesialis kandungan terlebih dahulu)",
    "Pada sebagian wanita, setelah melakukan pemeriksaan HSG, kemungkinan pasien akan mengalami keputihan/keluarnya darah dari organ reproduksi, maka disarankan untuk mempersiapkan pembalut.",
    "Pada sebagian wanita srosedur HSG dapat menimbulkan kram perut sementara pasca prosedure, untuk itu disarankan mengajak suami/keluarga untuk menemani pada saat pulang/ selesai pemeriksaan.",
  ];
  const BNO = [
    "Sehari sebelum pemeriksaan pasien hanya diperkenankan makan makanan lunak yang mudah dicerna dan tidak mengandung serat, serta minum air putih atau minuman lain yang tidak mengandung alcohol. Contoh: Bubur sumsum atau nasi tim dengan lauk rebus, teh atau sirup.",
    "Pukul 22.00 (10 malam) pasien makan malam terakhir, pantang merokok dan aktivitas bicara dikurangi.",
    "Pukul 04.00 pagi pasien minum obat pencahar/urus-urus (garam inggris 30 gram dilarutkan dalam 1 gelas air putih dan diminum sekaligus), selanjutnya dalam jangka waktu 1 jam minum air putih/the/sirup 4-5 gelas dilanjutkan puasa makan.",
    "Setelah pasien merasa tuntas buang air besar dan merasa tidak mulas, pasien datang ke ruang radiologi dalam keadaan masih puasa (belum makan dan minum) untuk dilakukan pemeriksaan.",
  ];

  let itemsToRender = [];

  if (namaPemeriksaan === 'APPENDICOGRAM') {
    itemsToRender = APPENDICOGRAM;
  } else if (namaPemeriksaan === 'USG_ABDOMEN') {
    itemsToRender = USG_ABDOMEN;
  } else if (namaPemeriksaan === 'HSG') {
    itemsToRender = HSG;
  } else if (namaPemeriksaan === 'BNO') {
    itemsToRender = BNO;
  }

  return (
    <div>
      {renderChecklist(itemsToRender)}
    </div>
  );
};

export default FormPersiapanPemeriksaan;
