import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const FormPersiapanPemeriksaan = ({ nama_pemeriksaan, jenis_pemeriksaan }) => {
  return (
    <div>
      {nama_pemeriksaan === "X-Ray" && jenis_pemeriksaan === "BNO" && (
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label="Sehari sebelum pemeriksaan pasien hanya diperkenankan makan makanan lunak yang mudah dicerna dan tidak mengandung serat, serta minum air putih atau minuman lain yang tidak mengandung alcohol. Contoh: Bubur sumsum atau nasi tim dengan lauk rebus, teh atau sirup."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pukul 22.00 (10 malam) pasien makan malam terakhir, pantang merokok dan aktivitas bicara dikurangi."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pukul 04.00 pagi pasien minum obat pencahar/urus-urus (garam inggris 30 gram dilarutkan dalam 1 gelas air putih dan diminum sekaligus), selanjutnya dalam jangka waktu 1 jam minum air putih/the/sirup 4-5 gelas dilanjutkan puasa makan."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Setelah pasien merasa tuntas buang air besar dan merasa tidak mulas, pasien datang ke ruang radiologi dalam keadaan masih puasa (belum makan dan minum) untuk dilakukan pemeriksaan."
          />
        </div>
      )}
      {nama_pemeriksaan === "X-Ray" && jenis_pemeriksaan === "APPENDICOGRAM" && (
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label="Pasien minum Barium sulfat (BaSO4) dengan cara: barium di encerkan dengan 1 gelas air putih dan diminum sampai habis, Setelah minum barium."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pasien diusahakan tidak muntah."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pasien diusahakan tidak BAB."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pasien puasa makan ± 8 jam (hingga pemeriksaan selesai dilakukan)."
          />
        </div>
      )}
      {nama_pemeriksaan === "X-Ray" && jenis_pemeriksaan === "HSG" && (
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label="Pemeriksaan HSG dilakukan di hari ke 7- 10/ sebelum ovulasi dihitung dari awal mulai menstruasi, Pada fase ini endometrium lebih tipis sehingga akan memberikan gambaran yang lebih jelas dan untuk memastikan pasien tidak hamil."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Tidak boleh melakukan hubungan sexual mulai dari hari pertama menstruasi sampai dengan Tindakan HSG selesai dilakukan."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pasien tidak sedang mengalami radang aktif di area reproduksi (konsultasikan dengan dokter spesialis kandungan terlebih dahulu)."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pada sebagian wanita, setelah melakukan pemeriksaan HSG, kemungkinan pasien akan mengalami keputihan/keluarnya darah dari organ reproduksi, maka disarankan untuk mempersiapkan pembalut."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Pada sebagian wanita srosedur HSG dapat menimbulkan kram perut sementara pasca prosedure, untuk itu disarankan mengajak suami/keluarga untuk menemani pada saat pulang/ selesai pemeriksaan."
          />
        </div>
      )}
      {nama_pemeriksaan === "USG" && jenis_pemeriksaan === "ABDOMEN" && (
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label="Puasa makan 6 jam sebelum pemeriksaan."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Selama puasa dianjurkan banyak minum air putih."
          />
          <FormControlLabel
            control={<Checkbox />}
            label="30 menit sebelum pemeriksaan USG minum ± 3 gelas air putih, lalu tahan kencing."
          />
        </div>
      )}
    </div>
  );
};

export default FormPersiapanPemeriksaan;
