import { DataRow } from '../types';

export type FormulaCategory =
  | 'Semua'
  | 'Matematika & Trigonometri'
  | 'Statistik'
  | 'Logika & Kondisional'
  | 'Teks & String'
  | 'Lookup & Referensi'
  | 'Tanggal & Waktu'
  | 'Finansial & Bisnis'
  | 'Informasi & Error';

export interface FormulaMeta {
  name: string;
  category: FormulaCategory;
  syntax: string;
  description: string;
  example: string;
  exampleExplanation: string;
  sampleResult: string | number | boolean;
}

export const EXCEL_FORMULA_CATALOG: FormulaMeta[] = [
  // MATEMATIKA & TRIGONOMETRI
  {
    name: 'SUM',
    category: 'Matematika & Trigonometri',
    syntax: 'SUM(angka1, [angka2], ...)',
    description: 'Menjumlahkan semua angka atau nilai dalam satu atau beberapa kolom/range.',
    example: '=SUM([Harga], [Ongkir]) atau =SUM(A1:A10)',
    exampleExplanation: 'Menjumlahkan nilai kolom Harga dan Ongkir.',
    sampleResult: 250000,
  },
  {
    name: 'SUMIF',
    category: 'Matematika & Trigonometri',
    syntax: 'SUMIF(range_kriteria, kriteria, [sum_range])',
    description: 'Menjumlahkan nilai yang memenuhi 1 kriteria tertentu.',
    example: '=SUMIF(Kategori, "Elektronik", Total)',
    exampleExplanation: 'Menjumlahkan kolom Total untuk baris yang Kategorinya adalah Elektronik.',
    sampleResult: 15400000,
  },
  {
    name: 'SUMIFS',
    category: 'Matematika & Trigonometri',
    syntax: 'SUMIFS(sum_range, range1, kriteria1, [range2, kriteria2], ...)',
    description: 'Menjumlahkan nilai dengan beberapa kriteria (multi-kriteria).',
    example: '=SUMIFS(Total, Kategori, "Elektronik", Status, "Lunas")',
    exampleExplanation: 'Menjumlahkan Total untuk Kategori Elektronik DAN Status Lunas.',
    sampleResult: 9800000,
  },
  {
    name: 'SUMPRODUCT',
    category: 'Matematika & Trigonometri',
    syntax: 'SUMPRODUCT(array1, [array2], ...)',
    description: 'Mengalikan komponen-komponen array terkait lalu menjumlahkan hasil kali tersebut.',
    example: '=SUMPRODUCT(Harga, Jumlah)',
    exampleExplanation: 'Menghitung total nilai persediaan (Harga * Jumlah untuk seluruh baris).',
    sampleResult: 45200000,
  },
  {
    name: 'PRODUCT',
    category: 'Matematika & Trigonometri',
    syntax: 'PRODUCT(angka1, [angka2], ...)',
    description: 'Mengalikan semua angka yang diberikan sebagai argumen.',
    example: '=PRODUCT([Qty], [Harga], 0.9)',
    exampleExplanation: 'Mengalikan Qty dengan Harga lalu didiskon 10% (kali 0.9).',
    sampleResult: 180000,
  },
  {
    name: 'ROUND',
    category: 'Matematika & Trigonometri',
    syntax: 'ROUND(angka, jumlah_digit)',
    description: 'Membulatkan angka ke jumlah digit desimal yang ditentukan.',
    example: '=ROUND([Nilai], 2)',
    exampleExplanation: 'Membulatkan 123.4567 menjadi 123.46.',
    sampleResult: 123.46,
  },
  {
    name: 'ROUNDUP',
    category: 'Matematika & Trigonometri',
    syntax: 'ROUNDUP(angka, jumlah_digit)',
    description: 'Membulatkan angka ke atas (menjauhi nol).',
    example: '=ROUNDUP(3.1415, 2)',
    exampleExplanation: 'Membulatkan 3.1415 ke atas menjadi 3.15.',
    sampleResult: 3.15,
  },
  {
    name: 'ROUNDDOWN',
    category: 'Matematika & Trigonometri',
    syntax: 'ROUNDDOWN(angka, jumlah_digit)',
    description: 'Membulatkan angka ke bawah (mendekati nol).',
    example: '=ROUNDDOWN(3.1499, 2)',
    exampleExplanation: 'Membulatkan 3.1499 ke bawah menjadi 3.14.',
    sampleResult: 3.14,
  },
  {
    name: 'CEILING',
    category: 'Matematika & Trigonometri',
    syntax: 'CEILING(angka, kelipatan)',
    description: 'Membulatkan angka ke atas ke kelipatan terdekat.',
    example: '=CEILING([Harga], 500)',
    exampleExplanation: 'Membulatkan harga 41200 ke kelipatan 500 terdekat menjadi 41500.',
    sampleResult: 41500,
  },
  {
    name: 'FLOOR',
    category: 'Matematika & Trigonometri',
    syntax: 'FLOOR(angka, kelipatan)',
    description: 'Membulatkan angka ke bawah ke kelipatan terdekat.',
    example: '=FLOOR([Harga], 1000)',
    exampleExplanation: 'Membulatkan harga 49800 ke kelipatan 1000 terdekat menjadi 49000.',
    sampleResult: 49000,
  },
  {
    name: 'ABS',
    category: 'Matematika & Trigonometri',
    syntax: 'ABS(angka)',
    description: 'Mengembalikan nilai absolut (mutlak positif) dari suatu angka.',
    example: '=ABS([Selisih])',
    exampleExplanation: 'Mengubah -45000 menjadi 45000.',
    sampleResult: 45000,
  },
  {
    name: 'MOD',
    category: 'Matematika & Trigonometri',
    syntax: 'MOD(angka, pembagi)',
    description: 'Menghasilkan sisa hasil bagi dari suatu pembagian bilangan bulat.',
    example: '=MOD(17, 5)',
    exampleExplanation: 'Sisa pembagian 17 dibagi 5 adalah 2.',
    sampleResult: 2,
  },
  {
    name: 'POWER',
    category: 'Matematika & Trigonometri',
    syntax: 'POWER(angka, pangkat) atau angka^pangkat',
    description: 'Menghitung hasil pemangkatan suatu angka.',
    example: '=POWER(2, 8) atau =2^8',
    exampleExplanation: '2 dipangkatkan 8 = 256.',
    sampleResult: 256,
  },
  {
    name: 'SQRT',
    category: 'Matematika & Trigonometri',
    syntax: 'SQRT(angka)',
    description: 'Menghitung akar kuadrat positif dari suatu angka.',
    example: '=SQRT(144)',
    exampleExplanation: 'Akar kuadrat dari 144 adalah 12.',
    sampleResult: 12,
  },
  {
    name: 'INT',
    category: 'Matematika & Trigonometri',
    syntax: 'INT(angka)',
    description: 'Membulatkan angka ke bawah ke bilangan bulat terdekat.',
    example: '=INT(9.95)',
    exampleExplanation: 'Mengambil bagian bulat dari 9.95 menjadi 9.',
    sampleResult: 9,
  },
  {
    name: 'TRUNC',
    category: 'Matematika & Trigonometri',
    syntax: 'TRUNC(angka, [jumlah_digit])',
    description: 'Memotong desimal angka tanpa pembulatan.',
    example: '=TRUNC(8.789, 1)',
    exampleExplanation: 'Memotong desimal menjadi 8.7.',
    sampleResult: 8.7,
  },
  {
    name: 'RAND',
    category: 'Matematika & Trigonometri',
    syntax: 'RAND()',
    description: 'Menghasilkan angka acak antara 0 dan 1.',
    example: '=RAND()',
    exampleExplanation: 'Menghasilkan angka desimal acak.',
    sampleResult: 0.7423,
  },
  {
    name: 'RANDBETWEEN',
    category: 'Matematika & Trigonometri',
    syntax: 'RANDBETWEEN(bawah, atas)',
    description: 'Menghasilkan angka bulat acak di antara rentang batas bawah dan atas.',
    example: '=RANDBETWEEN(100, 999)',
    exampleExplanation: 'Membuat nomor undian/kode acak 3 digit.',
    sampleResult: 642,
  },
  {
    name: 'PI',
    category: 'Matematika & Trigonometri',
    syntax: 'PI()',
    description: 'Mengembalikan nilai konstanta Pi (3.14159265...).',
    example: '=PI() * [JariJari]^2',
    exampleExplanation: 'Menghitung luas lingkaran.',
    sampleResult: 153.94,
  },
  {
    name: 'EXP',
    category: 'Matematika & Trigonometri',
    syntax: 'EXP(angka)',
    description: 'Menghitung bilangan e dipangkatkan dengan angka.',
    example: '=EXP(2)',
    exampleExplanation: 'e^2 = 7.389...',
    sampleResult: 7.389,
  },
  {
    name: 'LN',
    category: 'Matematika & Trigonometri',
    syntax: 'LN(angka)',
    description: 'Menghitung logaritma natural (basis e) dari suatu angka.',
    example: '=LN(10)',
    exampleExplanation: 'Logaritma natural 10.',
    sampleResult: 2.3026,
  },
  {
    name: 'LOG',
    category: 'Matematika & Trigonometri',
    syntax: 'LOG(angka, [basis])',
    description: 'Menghitung logaritma angka dengan basis tertentu (default 10).',
    example: '=LOG(1000, 10)',
    exampleExplanation: 'Log 1000 basis 10 = 3.',
    sampleResult: 3,
  },
  {
    name: 'LOG10',
    category: 'Matematika & Trigonometri',
    syntax: 'LOG10(angka)',
    description: 'Menghitung logaritma basis 10 dari suatu angka.',
    example: '=LOG10(100)',
    exampleExplanation: 'Log 100 basis 10 = 2.',
    sampleResult: 2,
  },
  {
    name: 'FACT',
    category: 'Matematika & Trigonometri',
    syntax: 'FACT(angka)',
    description: 'Menghitung faktorial dari suatu angka (n!).',
    example: '=FACT(5)',
    exampleExplanation: '5! = 5 x 4 x 3 x 2 x 1 = 120.',
    sampleResult: 120,
  },
  {
    name: 'SIGN',
    category: 'Matematika & Trigonometri',
    syntax: 'SIGN(angka)',
    description: 'Mengembalikan 1 jika positif, 0 jika nol, -1 jika negatif.',
    example: '=SIGN([LabaRugi])',
    exampleExplanation: 'Mengecek apakah bernilai positif (1), nol (0), atau minus (-1).',
    sampleResult: 1,
  },
  {
    name: 'SIN',
    category: 'Matematika & Trigonometri',
    syntax: 'SIN(radian)',
    description: 'Menghitung sinus sudut (dalam radian).',
    example: '=SIN(RADIANS(30))',
    exampleExplanation: 'Sin 30 derajat = 0.5.',
    sampleResult: 0.5,
  },
  {
    name: 'COS',
    category: 'Matematika & Trigonometri',
    syntax: 'COS(radian)',
    description: 'Menghitung kosinus sudut (dalam radian).',
    example: '=COS(RADIANS(60))',
    exampleExplanation: 'Cos 60 derajat = 0.5.',
    sampleResult: 0.5,
  },
  {
    name: 'TAN',
    category: 'Matematika & Trigonometri',
    syntax: 'TAN(radian)',
    description: 'Menghitung tangen sudut (dalam radian).',
    example: '=TAN(RADIANS(45))',
    exampleExplanation: 'Tan 45 derajat = 1.',
    sampleResult: 1,
  },
  {
    name: 'DEGREES',
    category: 'Matematika & Trigonometri',
    syntax: 'DEGREES(radian)',
    description: 'Mengubah satuan radian menjadi derajat.',
    example: '=DEGREES(PI())',
    exampleExplanation: 'Pi radian = 180 derajat.',
    sampleResult: 180,
  },
  {
    name: 'RADIANS',
    category: 'Matematika & Trigonometri',
    syntax: 'RADIANS(derajat)',
    description: 'Mengubah satuan derajat menjadi radian.',
    example: '=RADIANS(180)',
    exampleExplanation: '180 derajat = 3.14159 radian.',
    sampleResult: 3.14159,
  },

  // STATISTIK
  {
    name: 'AVERAGE',
    category: 'Statistik',
    syntax: 'AVERAGE(angka1, [angka2], ...)',
    description: 'Menghitung rata-rata aritmatika dari serangkaian nilai.',
    example: '=AVERAGE([Nilai1], [Nilai2], [Nilai3])',
    exampleExplanation: 'Rata-rata 3 nilai ujian.',
    sampleResult: 85.5,
  },
  {
    name: 'AVERAGEIF',
    category: 'Statistik',
    syntax: 'AVERAGEIF(range_kriteria, kriteria, [average_range])',
    description: 'Menghitung rata-rata nilai yang memenuhi 1 kriteria tertentu.',
    example: '=AVERAGEIF(Departemen, "Marketing", Gaji)',
    exampleExplanation: 'Rata-rata gaji karyawan bagian Marketing.',
    sampleResult: 7250000,
  },
  {
    name: 'AVERAGEIFS',
    category: 'Statistik',
    syntax: 'AVERAGEIFS(avg_range, range1, kriteria1, [range2, kriteria2], ...)',
    description: 'Menghitung rata-rata nilai yang memenuhi banyak kriteria.',
    example: '=AVERAGEIFS(Penjualan, Kota, "Jakarta", Kategori, "Laptop")',
    exampleExplanation: 'Rata-rata penjualan laptop di Jakarta.',
    sampleResult: 12500000,
  },
  {
    name: 'COUNT',
    category: 'Statistik',
    syntax: 'COUNT(nilai1, [nilai2], ...)',
    description: 'Menghitung jumlah sel yang berisi angka numerik.',
    example: '=COUNT(A1:A100) atau =COUNT([Harga])',
    exampleExplanation: 'Menghitung total baris yang memiliki angka harga valid.',
    sampleResult: 84,
  },
  {
    name: 'COUNTA',
    category: 'Statistik',
    syntax: 'COUNTA(nilai1, [nilai2], ...)',
    description: 'Menghitung jumlah sel yang tidak kosong (angka maupun teks).',
    example: '=COUNTA([NamaLengkap])',
    exampleExplanation: 'Menghitung total baris yang terisi nama.',
    sampleResult: 100,
  },
  {
    name: 'COUNTBLANK',
    category: 'Statistik',
    syntax: 'COUNTBLANK(range)',
    description: 'Menghitung jumlah sel yang kosong atau blank.',
    example: '=COUNTBLANK([Catatan])',
    exampleExplanation: 'Mengetahui berapa banyak transaksi yang belum ada catatan.',
    sampleResult: 16,
  },
  {
    name: 'COUNTIF',
    category: 'Statistik',
    syntax: 'COUNTIF(range, kriteria)',
    description: 'Menghitung jumlah baris yang memenuhi 1 kriteria.',
    example: '=COUNTIF(Status, "Lunas")',
    exampleExplanation: 'Menghitung berapa banyak transaksi yang sudah Lunas.',
    sampleResult: 42,
  },
  {
    name: 'COUNTIFS',
    category: 'Statistik',
    syntax: 'COUNTIFS(range1, kriteria1, [range2, kriteria2], ...)',
    description: 'Menghitung jumlah baris yang memenuhi beberapa kriteria sekaligus.',
    example: '=COUNTIFS(Kategori, "Pakaian", Status, "Lunas", Kota, "Surabaya")',
    exampleExplanation: 'Menghitung transaksi pakaian lunas di Surabaya.',
    sampleResult: 15,
  },
  {
    name: 'MAX',
    category: 'Statistik',
    syntax: 'MAX(angka1, [angka2], ...)',
    description: 'Mencari nilai angka tertinggi atau terbesar.',
    example: '=MAX([Harga], [Diskon]) atau =MAX(A1:A50)',
    exampleExplanation: 'Mencari harga transaksi terbesar dalam data.',
    sampleResult: 95000000,
  },
  {
    name: 'MAXIFS',
    category: 'Statistik',
    syntax: 'MAXIFS(max_range, range1, kriteria1, ...)',
    description: 'Mencari nilai tertinggi yang memenuhi satu atau banyak kriteria.',
    example: '=MAXIFS(Harga, Kategori, "Elektronik")',
    exampleExplanation: 'Harga tertinggi di kategori Elektronik.',
    sampleResult: 24500000,
  },
  {
    name: 'MIN',
    category: 'Statistik',
    syntax: 'MIN(angka1, [angka2], ...)',
    description: 'Mencari nilai angka terendah atau terkecil.',
    example: '=MIN(A1:A100) atau =MIN([Biaya])',
    exampleExplanation: 'Mencari biaya terkecil dalam data.',
    sampleResult: 15000,
  },
  {
    name: 'MINIFS',
    category: 'Statistik',
    syntax: 'MINIFS(min_range, range1, kriteria1, ...)',
    description: 'Mencari nilai terendah yang memenuhi satu atau banyak kriteria.',
    example: '=MINIFS(Harga, Kategori, "Aksesoris")',
    exampleExplanation: 'Harga terendah produk aksesoris.',
    sampleResult: 25000,
  },
  {
    name: 'MEDIAN',
    category: 'Statistik',
    syntax: 'MEDIAN(angka1, [angka2], ...)',
    description: 'Menghitung nilai tengah (median) dari sekumpulan angka.',
    example: '=MEDIAN(A1:A50) atau =MEDIAN([Gaji])',
    exampleExplanation: 'Mencari nilai tengah gaji karyawan.',
    sampleResult: 6500000,
  },
  {
    name: 'MODE',
    category: 'Statistik',
    syntax: 'MODE(angka1, [angka2], ...)',
    description: 'Mencari nilai yang paling sering muncul (modus).',
    example: '=MODE([UkuranSepatu])',
    exampleExplanation: 'Mencari ukuran sepatu paling populer.',
    sampleResult: 42,
  },
  {
    name: 'STDEV',
    category: 'Statistik',
    syntax: 'STDEV(angka1, [angka2], ...)',
    description: 'Menghitung estimasi standar deviasi sampel.',
    example: '=STDEV(A1:A100)',
    exampleExplanation: 'Mengukur sebaran data terhadap nilai rata-ratanya.',
    sampleResult: 14.82,
  },
  {
    name: 'STDEVP',
    category: 'Statistik',
    syntax: 'STDEVP(angka1, [angka2], ...)',
    description: 'Menghitung standar deviasi untuk seluruh populasi data.',
    example: '=STDEVP(A1:A100)',
    exampleExplanation: 'Standar deviasi populasi lengkap.',
    sampleResult: 14.75,
  },
  {
    name: 'VAR',
    category: 'Statistik',
    syntax: 'VAR(angka1, [angka2], ...)',
    description: 'Menghitung variansi sampel dari kumpulan data.',
    example: '=VAR([Nilai])',
    exampleExplanation: 'Variansi sampel data nilai.',
    sampleResult: 219.6,
  },
  {
    name: 'VARP',
    category: 'Statistik',
    syntax: 'VARP(angka1, [angka2], ...)',
    description: 'Menghitung variansi populasi lengkap.',
    example: '=VARP([Nilai])',
    exampleExplanation: 'Variansi populasi data nilai.',
    sampleResult: 217.4,
  },
  {
    name: 'LARGE',
    category: 'Statistik',
    syntax: 'LARGE(array, k)',
    description: 'Mengambil nilai terbesar ke-k dalam kumpulan data (misal peringkat ke-1, 2, 3).',
    example: '=LARGE(Gaji, 3)',
    exampleExplanation: 'Mengambil gaji tertinggi ke-3 di perusahaan.',
    sampleResult: 18000000,
  },
  {
    name: 'SMALL',
    category: 'Statistik',
    syntax: 'SMALL(array, k)',
    description: 'Mengambil nilai terkecil ke-k dalam kumpulan data.',
    example: '=SMALL(WaktuTempuh, 1)',
    exampleExplanation: 'Mengambil waktu tercepat/terkecil (Juara 1).',
    sampleResult: 10.45,
  },
  {
    name: 'RANK',
    category: 'Statistik',
    syntax: 'RANK(angka, ref, [urutan])',
    description: 'Menghitung peringkat suatu angka di dalam daftar (0 = menurun, 1 = menaik).',
    example: '=RANK([NilaiTotal], NilaiTotal, 0)',
    exampleExplanation: 'Menghitung ranking juara kelas berdasarkan nilai total.',
    sampleResult: 2,
  },
  {
    name: 'PERCENTILE',
    category: 'Statistik',
    syntax: 'PERCENTILE(array, k)',
    description: 'Mengembalikan persentil ke-k dari nilai dalam rentang (0 <= k <= 1).',
    example: '=PERCENTILE(Gaji, 0.9)',
    exampleExplanation: 'Batas gaji 10% tertinggi (persentil 90).',
    sampleResult: 22000000,
  },
  {
    name: 'QUARTILE',
    category: 'Statistik',
    syntax: 'QUARTILE(array, quart)',
    description: 'Mengembalikan kuartil dari kumpulan data (0=Min, 1=Q1, 2=Q2/Median, 3=Q3, 4=Max).',
    example: '=QUARTILE(Penjualan, 3)',
    exampleExplanation: 'Kuartil ke-3 (75% data berada di bawah nilai ini).',
    sampleResult: 17500000,
  },

  // LOGIKA & KONDISIONAL
  {
    name: 'IF',
    category: 'Logika & Kondisional',
    syntax: 'IF(tes_logika, nilai_jika_benar, [nilai_jika_salah])',
    description: 'Melakukan pengujian logika dan mengembalikan nilai berbeda jika BENAR vs SALAH.',
    example: '=IF([Nilai] >= 75, "LULUS", "REMIDI")',
    exampleExplanation: 'Jika nilai >= 75 hasil LULUS, jika kurang dari 75 hasil REMIDI.',
    sampleResult: 'LULUS',
  },
  {
    name: 'IFS',
    category: 'Logika & Kondisional',
    syntax: 'IFS(syarat1, hasil1, [syarat2, hasil2], ...)',
    description: 'Mengecek beberapa kondisi sekaligus tanpa perlu nested IF bertingkat.',
    example: '=IFS([Nilai] >= 90, "A", [Nilai] >= 80, "B", [Nilai] >= 70, "C", TRUE, "D")',
    exampleExplanation: 'Menentukan predikat nilai huruf A, B, C, atau D.',
    sampleResult: 'A',
  },
  {
    name: 'AND',
    category: 'Logika & Kondisional',
    syntax: 'AND(logika1, [logika2], ...)',
    description: 'Mengembalikan TRUE jika SEMUA kondisi bernilai benar.',
    example: '=IF(AND([Kehadiran] >= 80, [Nilai] >= 75), "LULUS", "TIDAK LULUS")',
    exampleExplanation: 'Lulus hanya jika kehadiran >= 80% DAN nilai >= 75.',
    sampleResult: 'LULUS',
  },
  {
    name: 'OR',
    category: 'Logika & Kondisional',
    syntax: 'OR(logika1, [logika2], ...)',
    description: 'Mengembalikan TRUE jika SALAH SATU kondisi bernilai benar.',
    example: '=IF(OR([Voucher] = "PROMO", [Total] > 500000), "Gratis Ongkir", "Bayar Ongkir")',
    exampleExplanation: 'Dapat gratis ongkir jika pakai voucher ATAU belanja > 500rb.',
    sampleResult: 'Gratis Ongkir',
  },
  {
    name: 'NOT',
    category: 'Logika & Kondisional',
    syntax: 'NOT(logika)',
    description: 'Membalikkan nilai logika (TRUE menjadi FALSE, FALSE menjadi TRUE).',
    example: '=IF(NOT([Status] = "Batal"), "Proses Kirim", "Dibatalkan")',
    exampleExplanation: 'Memproses pesanan jika statusnya BUKAN Batal.',
    sampleResult: 'Proses Kirim',
  },
  {
    name: 'XOR',
    category: 'Logika & Kondisional',
    syntax: 'XOR(logika1, [logika2], ...)',
    description: 'Exclusive OR: Menghasilkan TRUE jika jumlah argumen TRUE ganjil.',
    example: '=XOR(A1 > 50, B1 > 50)',
    exampleExplanation: 'TRUE jika hanya salah satu yang > 50, bukan keduanya.',
    sampleResult: true,
  },
  {
    name: 'SWITCH',
    category: 'Logika & Kondisional',
    syntax: 'SWITCH(ekspresi, nilai1, hasil1, [nilai2, hasil2], ..., [default])',
    description: 'Mencocokkan satu nilai terhadap daftar pilihan nilai.',
    example: '=SWITCH([Kode], 1, "Senin", 2, "Selasa", 3, "Rabu", "Lainnya")',
    exampleExplanation: 'Mengubah kode angka menjadi nama hari.',
    sampleResult: 'Senin',
  },
  {
    name: 'IFERROR',
    category: 'Logika & Kondisional',
    syntax: 'IFERROR(nilai, nilai_jika_error)',
    description: 'Mengembalikan nilai pengganti jika rumus menghasilkan error seperti #DIV/0! atau #N/A.',
    example: '=IFERROR([Total] / [Qty], 0)',
    exampleExplanation: 'Mencegah pembagian dengan nol (#DIV/0!) dengan menggantinya jadi 0.',
    sampleResult: 0,
  },
  {
    name: 'IFNA',
    category: 'Logika & Kondisional',
    syntax: 'IFNA(nilai, nilai_jika_na)',
    description: 'Mengembalikan nilai khusus hanya jika rumus menghasilkan error #N/A.',
    example: '=IFNA(VLOOKUP([Kode], [TabelReferensi], 2, FALSE), "Tidak Ditemukan")',
    exampleExplanation: 'Memberi teks ramah jika data lookup tidak ada.',
    sampleResult: 'Tidak Ditemukan',
  },
  {
    name: 'ISBLANK',
    category: 'Logika & Kondisional',
    syntax: 'ISBLANK(nilai)',
    description: 'Mengecek apakah suatu sel atau kolom dalam keadaan kosong.',
    example: '=IF(ISBLANK([Email]), "Email Wajib Diisi", "Valid")',
    exampleExplanation: 'Validasi kelengkapan form pendaftaran.',
    sampleResult: 'Valid',
  },
  {
    name: 'ISNUMBER',
    category: 'Logika & Kondisional',
    syntax: 'ISNUMBER(nilai)',
    description: 'Mengecek apakah suatu nilai berupa angka numerik valid.',
    example: '=IF(ISNUMBER([NoTelp]), "Valid", "Format Salah")',
    exampleExplanation: 'Memastikan no telp hanya berisi angka.',
    sampleResult: 'Valid',
  },
  {
    name: 'ISTEXT',
    category: 'Logika & Kondisional',
    syntax: 'ISTEXT(nilai)',
    description: 'Mengecek apakah suatu nilai adalah tipe data teks / string.',
    example: '=ISTEXT([Nama])',
    exampleExplanation: 'Mengecek tipe data nama.',
    sampleResult: true,
  },
  {
    name: 'ISERROR',
    category: 'Logika & Kondisional',
    syntax: 'ISERROR(nilai)',
    description: 'Mengecek apakah suatu ekspresi menghasilkan error (#VALUE!, #REF!, #DIV/0!, dll).',
    example: '=ISERROR(10 / 0)',
    exampleExplanation: 'Mendeteksi kalkulasi error.',
    sampleResult: true,
  },

  // TEKS & STRING
  {
    name: 'CONCAT',
    category: 'Teks & String',
    syntax: 'CONCAT(teks1, [teks2], ...)',
    description: 'Menggabungkan beberapa string teks menjadi satu string utuh.',
    example: '=CONCAT([NamaDepan], " ", [NamaBelakang])',
    exampleExplanation: 'Menggabungkan nama depan "Budi" dan nama belakang "Santoso" jadi "Budi Santoso".',
    sampleResult: 'Budi Santoso',
  },
  {
    name: 'CONCATENATE',
    category: 'Teks & String',
    syntax: 'CONCATENATE(teks1, [teks2], ...)',
    description: 'Rumus klasik untuk menggabungkan beberapa teks / kolom.',
    example: '=CONCATENATE("INV-", [Tahun], "-", [Nomor])',
    exampleExplanation: 'Membentuk format nomor invoice INV-2024-001.',
    sampleResult: 'INV-2024-001',
  },
  {
    name: 'TEXTJOIN',
    category: 'Teks & String',
    syntax: 'TEXTJOIN(pemisah, abaikan_kosong, teks1, [teks2], ...)',
    description: 'Menggabungkan teks dengan tanda pemisah (delimiter) dan opsi lewati teks kosong.',
    example: '=TEXTJOIN(", ", TRUE, [Jalan], [Kelurahan], [Kota])',
    exampleExplanation: 'Menyusun alamat lengkap rapi berpemisah koma.',
    sampleResult: 'Jl. Merdeka No 45, Gambir, Jakarta Pusat',
  },
  {
    name: 'LEFT',
    category: 'Teks & String',
    syntax: 'LEFT(teks, [jumlah_karakter])',
    description: 'Mengambil sejumlah karakter dari sisi paling kiri (awal) string.',
    example: '=LEFT([KodeBarang], 3)',
    exampleExplanation: 'Mengambil 3 huruf depan kode "ELK-908" menjadi "ELK".',
    sampleResult: 'ELK',
  },
  {
    name: 'RIGHT',
    category: 'Teks & String',
    syntax: 'RIGHT(teks, [jumlah_karakter])',
    description: 'Mengambil sejumlah karakter dari sisi paling kanan (akhir) string.',
    example: '=RIGHT([NoFaktur], 4)',
    exampleExplanation: 'Mengambil 4 digit terakhir nomor "FK-2024-8890" menjadi "8890".',
    sampleResult: '8890',
  },
  {
    name: 'MID',
    category: 'Teks & String',
    syntax: 'MID(teks, posisi_awal, jumlah_karakter)',
    description: 'Mengambil sejumlah karakter dari bagian tengah string.',
    example: '=MID([Kode], 4, 3)',
    exampleExplanation: 'Dari "ABC-123-XYZ" mulai posisi 4 ambil 3 karakter menghasilkan "123".',
    sampleResult: '123',
  },
  {
    name: 'LEN',
    category: 'Teks & String',
    syntax: 'LEN(teks)',
    description: 'Menghitung panjang jumlah karakter dalam teks (termasuk spasi).',
    example: '=LEN([NIK])',
    exampleExplanation: 'Mengecek apakah NIK berjumlah 16 digit.',
    sampleResult: 16,
  },
  {
    name: 'TRIM',
    category: 'Teks & String',
    syntax: 'TRIM(teks)',
    description: 'Menghapus spasi ganda dan spasi berlebih di awal & akhir teks.',
    example: '=TRIM([NamaCustomer])',
    exampleExplanation: 'Membersihkan "  PT   Maju   Jaya  " menjadi "PT Maju Jaya".',
    sampleResult: 'PT Maju Jaya',
  },
  {
    name: 'UPPER',
    category: 'Teks & String',
    syntax: 'UPPER(teks)',
    description: 'Mengubah semua huruf dalam teks menjadi HURUF BESAR (KAPITAL).',
    example: '=UPPER([Nama])',
    exampleExplanation: 'Mengubah "budi santoso" menjadi "BUDI SANTOSO".',
    sampleResult: 'BUDI SANTOSO',
  },
  {
    name: 'LOWER',
    category: 'Teks & String',
    syntax: 'LOWER(teks)',
    description: 'Mengubah semua huruf dalam teks menjadi huruf kecil.',
    example: '=LOWER([Email])',
    exampleExplanation: 'Mengubah "Budi@Domain.COM" menjadi "budi@domain.com".',
    sampleResult: 'budi@domain.com',
  },
  {
    name: 'PROPER',
    category: 'Teks & String',
    syntax: 'PROPER(teks)',
    description: 'Mengubah huruf pertama setiap kata menjadi Kapital (Title Case).',
    example: '=PROPER([NamaLengkap])',
    exampleExplanation: 'Mengubah "ahmad fadhil saputra" menjadi "Ahmad Fadhil Saputra".',
    sampleResult: 'Ahmad Fadhil Saputra',
  },
  {
    name: 'SUBSTITUTE',
    category: 'Teks & String',
    syntax: 'SUBSTITUTE(teks, teks_lama, teks_baru, [kemunculan_ke])',
    description: 'Mengganti kemunculan teks tertentu dengan teks yang baru.',
    example: '=SUBSTITUTE([NoTelp], "-", "")',
    exampleExplanation: 'Menghilangkan tanda strip pada "0812-3456-7890" menjadi "081234567890".',
    sampleResult: '081234567890',
  },
  {
    name: 'REPLACE',
    category: 'Teks & String',
    syntax: 'REPLACE(teks_lama, mulai, jumlah_karakter, teks_baru)',
    description: 'Mengganti bagian teks berdasarkan posisi awal dan jumlah karakter.',
    example: '=REPLACE([NoKartu], 5, 8, "********")',
    exampleExplanation: 'Menyensor no kartu "4532123456789012" menjadi "4532********9012".',
    sampleResult: '4532********9012',
  },
  {
    name: 'FIND',
    category: 'Teks & String',
    syntax: 'FIND(cari_teks, dalam_teks, [posisi_awal])',
    description: 'Mencari posisi nomor karakter suatu teks di dalam teks lain (Case-Sensitive).',
    example: '=FIND("@", [Email])',
    exampleExplanation: 'Menemukan posisi karakter @ pada email.',
    sampleResult: 5,
  },
  {
    name: 'SEARCH',
    category: 'Teks & String',
    syntax: 'SEARCH(cari_teks, dalam_teks, [posisi_awal])',
    description: 'Mencari posisi nomor karakter (Tidak sensitif huruf besar/kecil).',
    example: '=SEARCH("ltd", [NamaPerusahaan])',
    exampleExplanation: 'Mencari kata ltd tanpa peduli huruf besar/kecil.',
    sampleResult: 9,
  },
  {
    name: 'EXACT',
    category: 'Teks & String',
    syntax: 'EXACT(teks1, teks2)',
    description: 'Mengecek apakah dua teks identik persis (sensitif huruf besar/kecil).',
    example: '=EXACT([Password], [KonfirmasiPassword])',
    exampleExplanation: 'Mengecek kecocokan password.',
    sampleResult: true,
  },
  {
    name: 'REPT',
    category: 'Teks & String',
    syntax: 'REPT(teks, jumlah_kali)',
    description: 'Mengulang teks sebanyak jumlah yang ditentukan.',
    example: '=REPT("★", [Rating])',
    exampleExplanation: 'Menampilkan bintang rating (Rating 5 menghasilkan "★★★★★").',
    sampleResult: '★★★★★',
  },
  {
    name: 'TEXT',
    category: 'Teks & String',
    syntax: 'TEXT(nilai, format_teks)',
    description: 'Memformat angka atau tanggal menjadi teks dengan format khusus.',
    example: '=TEXT([Harga], "Rp #,##0")',
    exampleExplanation: 'Memformat angka 1500000 menjadi "Rp 1.500.000".',
    sampleResult: 'Rp 1.500.000',
  },
  {
    name: 'VALUE',
    category: 'Teks & String',
    syntax: 'VALUE(teks)',
    description: 'Mengubah teks string angka menjadi angka numerik murni.',
    example: '=VALUE("Rp 50.000")',
    exampleExplanation: 'Mengubah format teks rupiah menjadi angka 50000 untuk dihitung.',
    sampleResult: 50000,
  },
  {
    name: 'CHAR',
    category: 'Teks & String',
    syntax: 'CHAR(angka_kode)',
    description: 'Mengembalikan karakter berdasarkan kode nomor ANSI/Unicode.',
    example: '=CHAR(65)',
    exampleExplanation: 'Kode 65 adalah huruf "A".',
    sampleResult: 'A',
  },
  {
    name: 'CODE',
    category: 'Teks & String',
    syntax: 'CODE(teks)',
    description: 'Mengembalikan kode numerik karakter pertama dalam teks.',
    example: '=CODE("A")',
    exampleExplanation: 'Huruf "A" menghasilkan kode 65.',
    sampleResult: 65,
  },

  // LOOKUP & REFERENSI
  {
    name: 'VLOOKUP',
    category: 'Lookup & Referensi',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Mencari nilai pada kolom paling kiri tabel dan mengembalikan nilai di kolom ke-N baris yang sama.',
    example: '=VLOOKUP([KodeBarang], [DaftarProduk], 2, FALSE)',
    exampleExplanation: 'Mengambil Nama Produk berdasarkan Kode Barang.',
    sampleResult: 'Laptop Asus ROG',
  },
  {
    name: 'HLOOKUP',
    category: 'Lookup & Referensi',
    syntax: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    description: 'Mencari nilai pada baris paling atas tabel horizontal dan mengambil nilai pada baris ke-N.',
    example: '=HLOOKUP("Q1", [TabelKuartal], 2, FALSE)',
    exampleExplanation: 'Mencari data penjualan kuartal Q1.',
    sampleResult: 45000000,
  },
  {
    name: 'XLOOKUP',
    category: 'Lookup & Referensi',
    syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])',
    description: 'Rumus pencarian modern yang lebih cepat, fleksibel, bisa cari ke kiri/kanan tanpa index angka.',
    example: '=XLOOKUP([IDPegawai], ID, NamaLengkap, "Tidak Ditemukan")',
    exampleExplanation: 'Mencari nama pegawai dengan ID tertentu dengan fallback aman.',
    sampleResult: 'Siti Rahmawati',
  },
  {
    name: 'INDEX',
    category: 'Lookup & Referensi',
    syntax: 'INDEX(array, no_baris, [no_kolom])',
    description: 'Mengembalikan nilai pada pertemuan baris dan kolom tertentu dalam tabel.',
    example: '=INDEX(Harga, 3)',
    exampleExplanation: 'Mengambil harga pada baris ke-3.',
    sampleResult: 75000,
  },
  {
    name: 'MATCH',
    category: 'Lookup & Referensi',
    syntax: 'MATCH(lookup_value, lookup_array, [match_type])',
    description: 'Mencari posisi nomor urut baris suatu nilai di dalam daftar (0 = Exact Match).',
    example: '=MATCH("Laptop Pro", NamaProduk, 0)',
    exampleExplanation: 'Mencari baris ke berapa produk "Laptop Pro" berada.',
    sampleResult: 4,
  },
  {
    name: 'XMATCH',
    category: 'Lookup & Referensi',
    syntax: 'XMATCH(lookup_value, lookup_array, [match_mode], [search_mode])',
    description: 'Versi modern dari MATCH dengan dukungan exact match default dan pencarian mundur.',
    example: '=XMATCH([Target], NamaKaryawan)',
    exampleExplanation: 'Mencari indeks posisi target.',
    sampleResult: 6,
  },
  {
    name: 'CHOOSE',
    category: 'Lookup & Referensi',
    syntax: 'CHOOSE(nomor_indeks, nilai1, [nilai2], ...)',
    description: 'Memilih satu nilai dari daftar berdasarkan nomor indeks (1, 2, 3, dst).',
    example: '=CHOOSE(2, "Emas", "Perak", "Perunggu")',
    exampleExplanation: 'Memilih indeks 2 menghasilkan "Perak".',
    sampleResult: 'Perak',
  },
  {
    name: 'ROW',
    category: 'Lookup & Referensi',
    syntax: 'ROW([referensi])',
    description: 'Mengembalikan nomor baris suatu sel atau baris aktif saat ini.',
    example: '=ROW()',
    exampleExplanation: 'Menghasilkan nomor urut baris aktif.',
    sampleResult: 5,
  },
  {
    name: 'COLUMN',
    category: 'Lookup & Referensi',
    syntax: 'COLUMN([referensi])',
    description: 'Mengembalikan nomor urut kolom suatu sel.',
    example: '=COLUMN()',
    exampleExplanation: 'Kolom B menghasilkan nomor 2.',
    sampleResult: 2,
  },

  // TANGGAL & WAKTU
  {
    name: 'TODAY',
    category: 'Tanggal & Waktu',
    syntax: 'TODAY()',
    description: 'Mengembalikan tanggal hari ini (tanpa jam).',
    example: '=TODAY()',
    exampleExplanation: 'Tanggal sistem hari ini.',
    sampleResult: '2026-08-16',
  },
  {
    name: 'NOW',
    category: 'Tanggal & Waktu',
    syntax: 'NOW()',
    description: 'Mengembalikan tanggal dan waktu lengkap saat ini.',
    example: '=NOW()',
    exampleExplanation: 'Waktu presisi saat kalkulasi dijalankan.',
    sampleResult: '2026-08-16 11:22:59',
  },
  {
    name: 'DATE',
    category: 'Tanggal & Waktu',
    syntax: 'DATE(tahun, bulan, hari)',
    description: 'Membuat nilai tanggal valid dari angka tahun, bulan, dan hari.',
    example: '=DATE(2025, 12, 31)',
    exampleExplanation: 'Menghasilkan serial tanggal 31 Desember 2025.',
    sampleResult: '2025-12-31',
  },
  {
    name: 'TIME',
    category: 'Tanggal & Waktu',
    syntax: 'TIME(jam, menit, detik)',
    description: 'Membuat format waktu dari nilai jam, menit, dan detik.',
    example: '=TIME(14, 30, 0)',
    exampleExplanation: 'Menghasilkan jam 14:30:00 (02:30 PM).',
    sampleResult: '14:30:00',
  },
  {
    name: 'YEAR',
    category: 'Tanggal & Waktu',
    syntax: 'YEAR(tanggal)',
    description: 'Mengambil angka 4 digit tahun dari suatu tanggal.',
    example: '=YEAR([TanggalLahir])',
    exampleExplanation: 'Dari "1998-05-12" mengambil tahun 1998.',
    sampleResult: 1998,
  },
  {
    name: 'MONTH',
    category: 'Tanggal & Waktu',
    syntax: 'MONTH(tanggal)',
    description: 'Mengambil angka bulan (1-12) dari suatu tanggal.',
    example: '=MONTH([TanggalTransaksi])',
    exampleExplanation: 'Dari "2024-08-20" menghasilkan bulan 8.',
    sampleResult: 8,
  },
  {
    name: 'DAY',
    category: 'Tanggal & Waktu',
    syntax: 'DAY(tanggal)',
    description: 'Mengambil angka hari/tanggal (1-31) dari suatu tanggal.',
    example: '=DAY([TanggalJatuhTempo])',
    exampleExplanation: 'Dari "2024-11-25" menghasilkan 25.',
    sampleResult: 25,
  },
  {
    name: 'HOUR',
    category: 'Tanggal & Waktu',
    syntax: 'HOUR(waktu)',
    description: 'Mengambil angka jam (0-23) dari suatu data waktu.',
    example: '=HOUR("17:45:00")',
    exampleExplanation: 'Menghasilkan angka jam 17.',
    sampleResult: 17,
  },
  {
    name: 'MINUTE',
    category: 'Tanggal & Waktu',
    syntax: 'MINUTE(waktu)',
    description: 'Mengambil angka menit (0-59) dari suatu data waktu.',
    example: '=MINUTE("17:45:00")',
    exampleExplanation: 'Menghasilkan angka menit 45.',
    sampleResult: 45,
  },
  {
    name: 'SECOND',
    category: 'Tanggal & Waktu',
    syntax: 'SECOND(waktu)',
    description: 'Mengambil angka detik (0-59) dari suatu data waktu.',
    example: '=SECOND("17:45:30")',
    exampleExplanation: 'Menghasilkan angka detik 30.',
    sampleResult: 30,
  },
  {
    name: 'DATEDIF',
    category: 'Tanggal & Waktu',
    syntax: 'DATEDIF(tgl_awal, tgl_akhir, "satuan")',
    description: 'Menghitung selisih antara 2 tanggal ("Y"=Tahun, "M"=Bulan, "D"=Hari).',
    example: '=DATEDIF([TglMulai], [TglSelesai], "D")',
    exampleExplanation: 'Menghitung durasi proyek dalam jumlah hari.',
    sampleResult: 120,
  },
  {
    name: 'DAYS',
    category: 'Tanggal & Waktu',
    syntax: 'DAYS(tgl_akhir, tgl_awal)',
    description: 'Menghitung selisih jumlah hari di antara dua tanggal.',
    example: '=DAYS([TglJatuhTempo], TODAY())',
    exampleExplanation: 'Menghitung sisa hari menjelang jatuh tempo.',
    sampleResult: 14,
  },
  {
    name: 'EDATE',
    category: 'Tanggal & Waktu',
    syntax: 'EDATE(tgl_awal, jumlah_bulan)',
    description: 'Menambah atau mengurangi sejumlah bulan dari tanggal awal.',
    example: '=EDATE([TglLangganan], 12)',
    exampleExplanation: 'Menghitung tanggal habis masa langganan 1 tahun (12 bulan).',
    sampleResult: '2027-08-16',
  },
  {
    name: 'EOMONTH',
    category: 'Tanggal & Waktu',
    syntax: 'EOMONTH(tgl_awal, jumlah_bulan)',
    description: 'Mencari tanggal hari terakhir (End of Month) dari bulan yang ditentukan.',
    example: '=EOMONTH([TglFaktur], 0)',
    exampleExplanation: 'Mencari tanggal akhir bulan dari faktur berjalan (misal 31 Agustus).',
    sampleResult: '2026-08-31',
  },
  {
    name: 'WEEKDAY',
    category: 'Tanggal & Waktu',
    syntax: 'WEEKDAY(tanggal, [tipe_kembalian])',
    description: 'Mengembalikan nomor hari dalam seminggu (1=Minggu, 2=Senin, ..., 7=Sabtu).',
    example: '=WEEKDAY(TODAY())',
    exampleExplanation: 'Mengetahui hari ke berapa dalam minggu.',
    sampleResult: 1,
  },
  {
    name: 'WEEKNUM',
    category: 'Tanggal & Waktu',
    syntax: 'WEEKNUM(tanggal)',
    description: 'Mengembalikan nomor urut minggu dalam setahun (1-53).',
    example: '=WEEKNUM(TODAY())',
    exampleExplanation: 'Mengetahui transaksi berada di minggu ke berapa tahun ini.',
    sampleResult: 33,
  },
  {
    name: 'NETWORKDAYS',
    category: 'Tanggal & Waktu',
    syntax: 'NETWORKDAYS(tgl_mulai, tgl_selesai, [hari_libur])',
    description: 'Menghitung jumlah hari kerja efektif (tidak termasuk Sabtu & Minggu).',
    example: '=NETWORKDAYS("2026-08-01", "2026-08-31")',
    exampleExplanation: 'Menghitung hari kerja di bulan Agustus.',
    sampleResult: 21,
  },
  {
    name: 'YEARFRAC',
    category: 'Tanggal & Waktu',
    syntax: 'YEARFRAC(tgl_mulai, tgl_selesai)',
    description: 'Menghitung pecahan fraksi tahun antara dua tanggal.',
    example: '=YEARFRAC([TglLahir], TODAY())',
    exampleExplanation: 'Menghitung umur presisi dengan desimal (misal 27.5 tahun).',
    sampleResult: 27.5,
  },

  // FINANSIAL & BISNIS
  {
    name: 'PMT',
    category: 'Finansial & Bisnis',
    syntax: 'PMT(rate, nper, pv, [fv], [type])',
    description: 'Menghitung besarnya angsuran berkala pinjaman/kredit dengan bunga tetap.',
    example: '=PMT(0.12/12, 36, -100000000)',
    exampleExplanation: 'Cicilan bulanan pinjaman 100 juta selama 3 tahun bunga 12% per tahun.',
    sampleResult: 3321431,
  },
  {
    name: 'PV',
    category: 'Finansial & Bisnis',
    syntax: 'PV(rate, nper, pmt, [fv], [type])',
    description: 'Menghitung nilai sekarang (Present Value) dari serangkaian pembayaran masa depan.',
    example: '=PV(0.08/12, 60, -2000000)',
    exampleExplanation: 'Nilai sekarang dari investasi tabungan 2 juta/bulan selama 5 tahun.',
    sampleResult: 98637000,
  },
  {
    name: 'FV',
    category: 'Finansial & Bisnis',
    syntax: 'FV(rate, nper, pmt, [pv], [type])',
    description: 'Menghitung nilai masa depan (Future Value) dari suatu investasi.',
    example: '=FV(0.06/12, 120, -1000000)',
    exampleExplanation: 'Total tabungan 1 juta per bulan selama 10 tahun bunga 6% per tahun.',
    sampleResult: 163879346,
  },
  {
    name: 'NPER',
    category: 'Finansial & Bisnis',
    syntax: 'NPER(rate, pmt, pv, [fv], [type])',
    description: 'Menghitung jumlah periode pembayaran yang dibutuhkan untuk melunasi pinjaman/investasi.',
    example: '=NPER(0.1/12, -2000000, 50000000)',
    exampleExplanation: 'Berapa bulan melunasi 50 juta dengan cicilan 2 juta/bulan.',
    sampleResult: 28.5,
  },
  {
    name: 'RATE',
    category: 'Finansial & Bisnis',
    syntax: 'RATE(nper, pmt, pv, [fv], [type])',
    description: 'Menghitung suku bunga per periode pinjaman atau investasi.',
    example: '=RATE(48, -1500000, 50000000) * 12',
    exampleExplanation: 'Menghitung suku bunga tahunan efektif.',
    sampleResult: '9.8%',
  },
  {
    name: 'NPV',
    category: 'Finansial & Bisnis',
    syntax: 'NPV(rate, nilai1, [nilai2], ...)',
    description: 'Menghitung Net Present Value dari arus kas investasi berkala.',
    example: '=NPV(0.1, 20000000, 30000000, 40000000) - 60000000',
    exampleExplanation: 'Analisis kelayakan investasi proyek bisnis.',
    sampleResult: 12434259,
  },
  {
    name: 'IRR',
    category: 'Finansial & Bisnis',
    syntax: 'IRR(nilai_arus_kas, [tebakan])',
    description: 'Menghitung Internal Rate of Return dari serangkaian arus kas periodik.',
    example: '=IRR([-100000000, 30000000, 40000000, 50000000])',
    exampleExplanation: 'Tingkat pengembalian internal investasi modal.',
    sampleResult: '10.6%',
  },
  {
    name: 'SLN',
    category: 'Finansial & Bisnis',
    syntax: 'SLN(biaya_perolehan, nilai_sisa, umur_manfaat)',
    description: 'Menghitung penyusutan / depresiasi aset metode garis lurus (Straight-Line).',
    example: '=SLN(120000000, 20000000, 5)',
    exampleExplanation: 'Depresiasi kendaraan operasional per tahun.',
    sampleResult: 20000000,
  },
  {
    name: 'SYD',
    category: 'Finansial & Bisnis',
    syntax: 'SYD(biaya, sisa, umur, periode)',
    description: 'Menghitung penyusutan aset metode jumlah angka tahun (Sum-of-Years Digits).',
    example: '=SYD(100000000, 10000000, 5, 1)',
    exampleExplanation: 'Depresiasi aset di tahun ke-1.',
    sampleResult: 30000000,
  },
  {
    name: 'DB',
    category: 'Finansial & Bisnis',
    syntax: 'DB(biaya, sisa, umur, periode, [bulan])',
    description: 'Menghitung penyusutan saldo menurun dengan tarif tetap.',
    example: '=DB(10000000, 1000000, 6, 1)',
    exampleExplanation: 'Depresiasi mesin pabrik periode ke-1.',
    sampleResult: 3190000,
  },

  // INFORMASI & ERROR
  {
    name: 'ISNONTEXT',
    category: 'Informasi & Error',
    syntax: 'ISNONTEXT(nilai)',
    description: 'Mengecek apakah suatu item bukan berupa teks (misal angka atau blank).',
    example: '=ISNONTEXT([Kode])',
    exampleExplanation: 'Mengecek apakah isi sel bukan teks.',
    sampleResult: true,
  },
  {
    name: 'ISODD',
    category: 'Informasi & Error',
    syntax: 'ISODD(angka)',
    description: 'Mengecek apakah suatu bilangan bulat adalah angka ganjil.',
    example: '=ISODD([NomorPlat])',
    exampleExplanation: 'Mendeteksi nomor ganjil untuk aturan ganjil-genap.',
    sampleResult: true,
  },
  {
    name: 'ISEVEN',
    category: 'Informasi & Error',
    syntax: 'ISEVEN(angka)',
    description: 'Mengecek apakah suatu bilangan bulat adalah angka genap.',
    example: '=ISEVEN([NomorPlat])',
    exampleExplanation: 'Mendeteksi nomor genap.',
    sampleResult: false,
  },
  {
    name: 'NA',
    category: 'Informasi & Error',
    syntax: 'NA()',
    description: 'Mengembalikan nilai error #N/A yang menandakan data tidak tersedia.',
    example: '=NA()',
    exampleExplanation: 'Memberikan penanda error eksplisit.',
    sampleResult: '#N/A',
  },
  {
    name: 'TYPE',
    category: 'Informasi & Error',
    syntax: 'TYPE(nilai)',
    description: 'Mengembalikan kode jenis tipe data (1=Angka, 2=Teks, 4=Logika, 16=Error).',
    example: '=TYPE([Nilai])',
    exampleExplanation: 'Memeriksa tipe data sel.',
    sampleResult: 1,
  },
  {
    name: 'N',
    category: 'Informasi & Error',
    syntax: 'N(nilai)',
    description: 'Mengonversi nilai non-angka menjadi angka (TRUE=1, FALSE=0, Teks=0).',
    example: '=N([StatusLunas])',
    exampleExplanation: 'Mengubah boolean ke angka 1 atau 0.',
    sampleResult: 1,
  },
];

// Helper: parse numbers safely
export function parseNum(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  const clean = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

// Token types for formula parser
type TokenType = 'IDENTIFIER' | 'STRING' | 'NUMBER' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'COLON';

interface Token {
  type: TokenType;
  value: string;
}

// Tokenizer
export function tokenizeFormula(expr: string): Token[] {
  let str = expr.trim();
  if (str.startsWith('=')) str = str.substring(1).trim();

  const tokens: Token[] = [];
  let i = 0;

  while (i < str.length) {
    const ch = str[i];

    // Whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // String literals "..." or '...'
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let text = '';
      i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\' && i + 1 < str.length) {
          text += str[i + 1];
          i += 2;
        } else {
          text += str[i];
          i++;
        }
      }
      i++; // skip closing quote
      tokens.push({ type: 'STRING', value: text });
      continue;
    }

    // Bracketed column names [Column Name]
    if (ch === '[') {
      let colName = '';
      i++;
      while (i < str.length && str[i] !== ']') {
        colName += str[i];
        i++;
      }
      i++; // skip ]
      tokens.push({ type: 'IDENTIFIER', value: colName.trim() });
      continue;
    }

    // Parentheses & delimiters
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    if (ch === ',' || ch === ';') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }
    if (ch === ':') {
      tokens.push({ type: 'COLON', value: ':' });
      i++;
      continue;
    }

    // Multi-char comparison operators: <=, >=, <>, !=, ==
    if (i + 1 < str.length) {
      const two = str.substring(i, i + 2);
      if (['<=', '>=', '<>', '!=', '=='].includes(two)) {
        tokens.push({ type: 'OPERATOR', value: two === '==' ? '=' : two === '!=' ? '<>' : two });
        i += 2;
        continue;
      }
    }

    // Single-char operators: +, -, *, /, ^, %, &, =, <, >
    if (['+', '-', '*', '/', '^', '%', '&', '=', '<', '>'].includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < str.length && /[0-9]/.test(str[i + 1]))) {
      let numStr = '';
      while (i < str.length && /[0-9.]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Identifiers (function names, unbracketed column names, cell references)
    if (/[a-zA-Z_$\u00C0-\u024F]/.test(ch)) {
      let idStr = '';
      while (i < str.length && /[a-zA-Z0-9_$.\u00C0-\u024F]/.test(str[i])) {
        idStr += str[i];
        i++;
      }
      tokens.push({ type: 'IDENTIFIER', value: idStr });
      continue;
    }

    // Catch-all
    tokens.push({ type: 'IDENTIFIER', value: ch });
    i++;
  }

  return tokens;
}

// AST Nodes
type ASTNode =
  | { type: 'Literal'; value: any }
  | { type: 'Identifier'; name: string }
  | { type: 'Range'; start: string; end: string }
  | { type: 'Unary'; operator: string; argument: ASTNode }
  | { type: 'Binary'; operator: string; left: ASTNode; right: ASTNode }
  | { type: 'FunctionCall'; name: string; args: ASTNode[] };

// Recursive Descent Parser
class FormulaParser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  private next(): Token | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos++] : null;
  }

  public parse(): ASTNode {
    if (this.tokens.length === 0) return { type: 'Literal', value: '' };
    const node = this.parseComparison();
    return node;
  }

  private parseComparison(): ASTNode {
    let left = this.parseConcat();
    while (this.peek() && this.peek()!.type === 'OPERATOR' && ['=', '<>', '<', '>', '<=', '>='].includes(this.peek()!.value)) {
      const op = this.next()!.value;
      const right = this.parseConcat();
      left = { type: 'Binary', operator: op, left, right };
    }
    return left;
  }

  private parseConcat(): ASTNode {
    let left = this.parseAdditive();
    while (this.peek() && this.peek()!.type === 'OPERATOR' && this.peek()!.value === '&') {
      const op = this.next()!.value;
      const right = this.parseAdditive();
      left = { type: 'Binary', operator: op, left, right };
    }
    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    while (this.peek() && this.peek()!.type === 'OPERATOR' && ['+', '-'].includes(this.peek()!.value)) {
      const op = this.next()!.value;
      const right = this.parseMultiplicative();
      left = { type: 'Binary', operator: op, left, right };
    }
    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parsePower();
    while (this.peek() && this.peek()!.type === 'OPERATOR' && ['*', '/', '%'].includes(this.peek()!.value)) {
      const op = this.next()!.value;
      const right = this.parsePower();
      left = { type: 'Binary', operator: op, left, right };
    }
    return left;
  }

  private parsePower(): ASTNode {
    let left = this.parseUnary();
    while (this.peek() && this.peek()!.type === 'OPERATOR' && this.peek()!.value === '^') {
      const op = this.next()!.value;
      const right = this.parseUnary();
      left = { type: 'Binary', operator: op, left, right };
    }
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.peek() && this.peek()!.type === 'OPERATOR' && ['+', '-'].includes(this.peek()!.value)) {
      const op = this.next()!.value;
      const arg = this.parsePrimary();
      return { type: 'Unary', operator: op, argument: arg };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.next();
    if (!token) return { type: 'Literal', value: '' };

    if (token.type === 'NUMBER') {
      return { type: 'Literal', value: parseFloat(token.value) };
    }

    if (token.type === 'STRING') {
      return { type: 'Literal', value: token.value };
    }

    if (token.type === 'LPAREN') {
      const expr = this.parseComparison();
      if (this.peek() && this.peek()!.type === 'RPAREN') {
        this.next(); // consume )
      }
      return expr;
    }

    if (token.type === 'IDENTIFIER') {
      const name = token.value;

      // Check if it's a function call: NAME ( ... )
      if (this.peek() && this.peek()!.type === 'LPAREN') {
        this.next(); // consume (
        const args: ASTNode[] = [];
        while (this.peek() && this.peek()!.type !== 'RPAREN') {
          args.push(this.parseComparison());
          if (this.peek() && this.peek()!.type === 'COMMA') {
            this.next(); // consume ,
          } else {
            break;
          }
        }
        if (this.peek() && this.peek()!.type === 'RPAREN') {
          this.next(); // consume )
        }
        return { type: 'FunctionCall', name: name.toUpperCase(), args };
      }

      // Check for Range colon: A1:A10 or Col1:Col2
      if (this.peek() && this.peek()!.type === 'COLON') {
        this.next(); // consume :
        const endToken = this.next();
        return { type: 'Range', start: name, end: endToken ? endToken.value : name };
      }

      // Handle Boolean literals
      if (name.toUpperCase() === 'TRUE') return { type: 'Literal', value: true };
      if (name.toUpperCase() === 'FALSE') return { type: 'Literal', value: false };

      return { type: 'Identifier', name };
    }

    return { type: 'Literal', value: token.value };
  }
}

// Function Implementations Evaluator
export function evaluateAST(
  node: ASTNode,
  currentRow: DataRow,
  allRows: DataRow[],
  columns: string[],
  rowIndex: number
): any {
  if (node.type === 'Literal') {
    return node.value;
  }

  if (node.type === 'Identifier') {
    const colName = node.name;
    // Check if column exists in row (case-insensitive fallback)
    if (currentRow[colName] !== undefined) {
      return currentRow[colName];
    }
    const matchedCol = columns.find((c) => c.toLowerCase() === colName.toLowerCase());
    if (matchedCol && currentRow[matchedCol] !== undefined) {
      return currentRow[matchedCol];
    }
    // Check if it's a number
    const num = parseFloat(colName);
    if (!isNaN(num)) return num;
    return colName;
  }

  if (node.type === 'Range') {
    // Return all values from column or range
    const targetCol = columns.find((c) => c.toLowerCase() === node.start.toLowerCase()) || node.start;
    return allRows.map((r) => r[targetCol]);
  }

  if (node.type === 'Unary') {
    const val = evaluateAST(node.argument, currentRow, allRows, columns, rowIndex);
    if (node.operator === '-') return -parseNum(val);
    if (node.operator === '+') return +parseNum(val);
    return val;
  }

  if (node.type === 'Binary') {
    const leftVal = evaluateAST(node.left, currentRow, allRows, columns, rowIndex);
    const rightVal = evaluateAST(node.right, currentRow, allRows, columns, rowIndex);

    switch (node.operator) {
      case '+':
        return parseNum(leftVal) + parseNum(rightVal);
      case '-':
        return parseNum(leftVal) - parseNum(rightVal);
      case '*':
        return parseNum(leftVal) * parseNum(rightVal);
      case '/': {
        const d = parseNum(rightVal);
        return d !== 0 ? parseNum(leftVal) / d : '#DIV/0!';
      }
      case '%':
        return parseNum(leftVal) % parseNum(rightVal);
      case '^':
        return Math.pow(parseNum(leftVal), parseNum(rightVal));
      case '&':
        return String(leftVal ?? '') + String(rightVal ?? '');
      case '=':
        return String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
      case '<>':
        return String(leftVal).toLowerCase() !== String(rightVal).toLowerCase();
      case '>':
        return parseNum(leftVal) > parseNum(rightVal);
      case '<':
        return parseNum(leftVal) < parseNum(rightVal);
      case '>=':
        return parseNum(leftVal) >= parseNum(rightVal);
      case '<=':
        return parseNum(leftVal) <= parseNum(rightVal);
      default:
        return 0;
    }
  }

  if (node.type === 'FunctionCall') {
    const fnName = node.name.toUpperCase();
    const evaluatedArgs = node.args.map((a) => evaluateAST(a, currentRow, allRows, columns, rowIndex));

    return executeExcelFunction(fnName, evaluatedArgs, node.args, currentRow, allRows, columns, rowIndex);
  }

  return '';
}

// Flat values extractor for SUM, AVERAGE, COUNT, MAX, MIN
function extractFlatNumbers(args: any[]): number[] {
  const nums: number[] = [];
  for (const item of args) {
    if (Array.isArray(item)) {
      item.forEach((x) => nums.push(parseNum(x)));
    } else {
      nums.push(parseNum(item));
    }
  }
  return nums;
}

// 80+ EXCEL FUNCTION ENGINE IMPLEMENTATION
function executeExcelFunction(
  fn: string,
  args: any[],
  rawArgNodes: ASTNode[],
  currentRow: DataRow,
  allRows: DataRow[],
  columns: string[],
  rowIndex: number
): any {
  try {
    switch (fn) {
      // --- MATEMATIKA ---
      case 'SUM': {
        const nums = extractFlatNumbers(args);
        return nums.reduce((acc, v) => acc + v, 0);
      }
      case 'SUMIF': {
        // SUMIF(kriteria_range, criteria, [sum_range])
        const critColNode = rawArgNodes[0];
        const critColName = critColNode.type === 'Identifier' ? critColNode.name : String(args[0]);
        const matchedCritCol = columns.find((c) => c.toLowerCase() === critColName.toLowerCase()) || critColName;
        const criteria = String(args[1] ?? '').toLowerCase().trim();

        const sumColNode = rawArgNodes[2] || rawArgNodes[0];
        const sumColName = sumColNode.type === 'Identifier' ? sumColNode.name : String(args[2] ?? args[0]);
        const matchedSumCol = columns.find((c) => c.toLowerCase() === sumColName.toLowerCase()) || sumColName;

        let total = 0;
        allRows.forEach((r) => {
          const valStr = String(r[matchedCritCol] ?? '').toLowerCase().trim();
          let match = false;
          if (criteria.startsWith('>') || criteria.startsWith('<') || criteria.startsWith('=')) {
            const op = criteria.startsWith('>=') ? '>=' : criteria.startsWith('<=') ? '<=' : criteria.startsWith('<>') ? '<>' : criteria[0];
            const target = parseFloat(criteria.replace(op, ''));
            const curVal = parseNum(r[matchedCritCol]);
            if (op === '>') match = curVal > target;
            else if (op === '<') match = curVal < target;
            else if (op === '>=') match = curVal >= target;
            else if (op === '<=') match = curVal <= target;
            else if (op === '<>') match = curVal !== target;
            else if (op === '=') match = curVal === target;
          } else {
            match = valStr === criteria;
          }
          if (match) {
            total += parseNum(r[matchedSumCol]);
          }
        });
        return total;
      }
      case 'SUMIFS': {
        // SUMIFS(sum_range, range1, crit1, [range2, crit2], ...)
        const sumColNode = rawArgNodes[0];
        const sumColName = sumColNode.type === 'Identifier' ? sumColNode.name : String(args[0]);
        const matchedSumCol = columns.find((c) => c.toLowerCase() === sumColName.toLowerCase()) || sumColName;

        let total = 0;
        allRows.forEach((r) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const cNode = rawArgNodes[i];
            const cCol = cNode && cNode.type === 'Identifier' ? cNode.name : String(args[i]);
            const matchedCol = columns.find((c) => c.toLowerCase() === cCol.toLowerCase()) || cCol;
            const targetCrit = String(args[i + 1] ?? '').toLowerCase().trim();
            const cellVal = String(r[matchedCol] ?? '').toLowerCase().trim();
            if (cellVal !== targetCrit) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            total += parseNum(r[matchedSumCol]);
          }
        });
        return total;
      }
      case 'SUMPRODUCT': {
        // SUMPRODUCT(col1, col2, ...)
        let total = 0;
        allRows.forEach((r) => {
          let product = 1;
          for (let i = 0; i < rawArgNodes.length; i++) {
            const node = rawArgNodes[i];
            const col = node.type === 'Identifier' ? node.name : '';
            const matchedCol = columns.find((c) => c.toLowerCase() === col.toLowerCase());
            const val = matchedCol ? parseNum(r[matchedCol]) : parseNum(args[i]);
            product *= val;
          }
          total += product;
        });
        return total;
      }
      case 'PRODUCT': {
        const nums = extractFlatNumbers(args);
        return nums.reduce((acc, v) => acc * v, 1);
      }
      case 'ROUND': {
        const num = parseNum(args[0]);
        const dec = parseNum(args[1] || 0);
        return Number(Math.round(Number(num + 'e' + dec)) + 'e-' + dec);
      }
      case 'ROUNDUP': {
        const num = parseNum(args[0]);
        const dec = parseNum(args[1] || 0);
        return Number(Math.ceil(Number(num + 'e' + dec)) + 'e-' + dec);
      }
      case 'ROUNDDOWN': {
        const num = parseNum(args[0]);
        const dec = parseNum(args[1] || 0);
        return Number(Math.floor(Number(num + 'e' + dec)) + 'e-' + dec);
      }
      case 'CEILING': {
        const num = parseNum(args[0]);
        const mult = parseNum(args[1] || 1);
        return mult === 0 ? 0 : Math.ceil(num / mult) * mult;
      }
      case 'FLOOR': {
        const num = parseNum(args[0]);
        const mult = parseNum(args[1] || 1);
        return mult === 0 ? 0 : Math.floor(num / mult) * mult;
      }
      case 'ABS':
        return Math.abs(parseNum(args[0]));
      case 'MOD': {
        const n = parseNum(args[0]);
        const d = parseNum(args[1]);
        return d !== 0 ? n % d : '#DIV/0!';
      }
      case 'POWER':
        return Math.pow(parseNum(args[0]), parseNum(args[1]));
      case 'SQRT': {
        const n = parseNum(args[0]);
        return n >= 0 ? Math.sqrt(n) : '#NUM!';
      }
      case 'INT':
        return Math.floor(parseNum(args[0]));
      case 'TRUNC': {
        const num = parseNum(args[0]);
        const digits = parseNum(args[1] || 0);
        const factor = Math.pow(10, digits);
        return Math.trunc(num * factor) / factor;
      }
      case 'RAND':
        return Math.random();
      case 'RANDBETWEEN': {
        const min = Math.ceil(parseNum(args[0]));
        const max = Math.floor(parseNum(args[1]));
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      case 'PI':
        return Math.PI;
      case 'EXP':
        return Math.exp(parseNum(args[0]));
      case 'LN': {
        const n = parseNum(args[0]);
        return n > 0 ? Math.log(n) : '#NUM!';
      }
      case 'LOG': {
        const n = parseNum(args[0]);
        const base = args[1] !== undefined ? parseNum(args[1]) : 10;
        return n > 0 && base > 0 && base !== 1 ? Math.log(n) / Math.log(base) : '#NUM!';
      }
      case 'LOG10': {
        const n = parseNum(args[0]);
        return n > 0 ? Math.log10(n) : '#NUM!';
      }
      case 'FACT': {
        const n = Math.floor(parseNum(args[0]));
        if (n < 0) return '#NUM!';
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      }
      case 'SIGN': {
        const n = parseNum(args[0]);
        return n > 0 ? 1 : n < 0 ? -1 : 0;
      }
      case 'SIN':
        return Math.sin(parseNum(args[0]));
      case 'COS':
        return Math.cos(parseNum(args[0]));
      case 'TAN':
        return Math.tan(parseNum(args[0]));
      case 'DEGREES':
        return (parseNum(args[0]) * 180) / Math.PI;
      case 'RADIANS':
        return (parseNum(args[0]) * Math.PI) / 180;

      // --- STATISTIK ---
      case 'AVERAGE': {
        const nums = extractFlatNumbers(args);
        return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
      }
      case 'AVERAGEIF': {
        const critColNode = rawArgNodes[0];
        const critCol = critColNode.type === 'Identifier' ? critColNode.name : String(args[0]);
        const matchedCritCol = columns.find((c) => c.toLowerCase() === critCol.toLowerCase()) || critCol;
        const criteria = String(args[1] ?? '').toLowerCase().trim();

        const avgColNode = rawArgNodes[2] || rawArgNodes[0];
        const avgCol = avgColNode.type === 'Identifier' ? avgColNode.name : String(args[2] ?? args[0]);
        const matchedAvgCol = columns.find((c) => c.toLowerCase() === avgCol.toLowerCase()) || avgCol;

        const filtered = allRows.filter((r) => String(r[matchedCritCol] ?? '').toLowerCase().trim() === criteria);
        if (filtered.length === 0) return 0;
        const sum = filtered.reduce((acc, r) => acc + parseNum(r[matchedAvgCol]), 0);
        return sum / filtered.length;
      }
      case 'AVERAGEIFS': {
        const avgColNode = rawArgNodes[0];
        const avgCol = avgColNode.type === 'Identifier' ? avgColNode.name : String(args[0]);
        const matchedAvgCol = columns.find((c) => c.toLowerCase() === avgCol.toLowerCase()) || avgCol;

        let total = 0;
        let count = 0;
        allRows.forEach((r) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const cNode = rawArgNodes[i];
            const cCol = cNode && cNode.type === 'Identifier' ? cNode.name : String(args[i]);
            const matchedCol = columns.find((c) => c.toLowerCase() === cCol.toLowerCase()) || cCol;
            const targetCrit = String(args[i + 1] ?? '').toLowerCase().trim();
            if (String(r[matchedCol] ?? '').toLowerCase().trim() !== targetCrit) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            total += parseNum(r[matchedAvgCol]);
            count++;
          }
        });
        return count > 0 ? total / count : 0;
      }
      case 'COUNT': {
        const nums = extractFlatNumbers(args).filter((n) => !isNaN(n));
        return nums.length;
      }
      case 'COUNTA': {
        let count = 0;
        for (const item of args) {
          if (Array.isArray(item)) {
            count += item.filter((x) => x !== null && x !== undefined && x !== '').length;
          } else if (item !== null && item !== undefined && item !== '') {
            count++;
          }
        }
        return count;
      }
      case 'COUNTBLANK': {
        let count = 0;
        for (const item of args) {
          if (Array.isArray(item)) {
            count += item.filter((x) => x === null || x === undefined || x === '').length;
          } else if (item === null || item === undefined || item === '') {
            count++;
          }
        }
        return count;
      }
      case 'COUNTIF': {
        const critColNode = rawArgNodes[0];
        const critCol = critColNode.type === 'Identifier' ? critColNode.name : String(args[0]);
        const matchedCol = columns.find((c) => c.toLowerCase() === critCol.toLowerCase()) || critCol;
        const target = String(args[1] ?? '').toLowerCase().trim();
        return allRows.filter((r) => String(r[matchedCol] ?? '').toLowerCase().trim() === target).length;
      }
      case 'COUNTIFS': {
        let count = 0;
        allRows.forEach((r) => {
          let allMatch = true;
          for (let i = 0; i < args.length; i += 2) {
            const cNode = rawArgNodes[i];
            const cCol = cNode && cNode.type === 'Identifier' ? cNode.name : String(args[i]);
            const matchedCol = columns.find((c) => c.toLowerCase() === cCol.toLowerCase()) || cCol;
            const targetCrit = String(args[i + 1] ?? '').toLowerCase().trim();
            if (String(r[matchedCol] ?? '').toLowerCase().trim() !== targetCrit) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) count++;
        });
        return count;
      }
      case 'MAX': {
        const nums = extractFlatNumbers(args);
        return nums.length > 0 ? Math.max(...nums) : 0;
      }
      case 'MAXIFS': {
        const maxColNode = rawArgNodes[0];
        const maxCol = maxColNode.type === 'Identifier' ? maxColNode.name : String(args[0]);
        const matchedMaxCol = columns.find((c) => c.toLowerCase() === maxCol.toLowerCase()) || maxCol;
        let maxVal = -Infinity;
        allRows.forEach((r) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const cNode = rawArgNodes[i];
            const cCol = cNode && cNode.type === 'Identifier' ? cNode.name : String(args[i]);
            const matchedCol = columns.find((c) => c.toLowerCase() === cCol.toLowerCase()) || cCol;
            const targetCrit = String(args[i + 1] ?? '').toLowerCase().trim();
            if (String(r[matchedCol] ?? '').toLowerCase().trim() !== targetCrit) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            const v = parseNum(r[matchedMaxCol]);
            if (v > maxVal) maxVal = v;
          }
        });
        return maxVal === -Infinity ? 0 : maxVal;
      }
      case 'MIN': {
        const nums = extractFlatNumbers(args);
        return nums.length > 0 ? Math.min(...nums) : 0;
      }
      case 'MINIFS': {
        const minColNode = rawArgNodes[0];
        const minCol = minColNode.type === 'Identifier' ? minColNode.name : String(args[0]);
        const matchedMinCol = columns.find((c) => c.toLowerCase() === minCol.toLowerCase()) || minCol;
        let minVal = Infinity;
        allRows.forEach((r) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const cNode = rawArgNodes[i];
            const cCol = cNode && cNode.type === 'Identifier' ? cNode.name : String(args[i]);
            const matchedCol = columns.find((c) => c.toLowerCase() === cCol.toLowerCase()) || cCol;
            const targetCrit = String(args[i + 1] ?? '').toLowerCase().trim();
            if (String(r[matchedCol] ?? '').toLowerCase().trim() !== targetCrit) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            const v = parseNum(r[matchedMinCol]);
            if (v < minVal) minVal = v;
          }
        });
        return minVal === Infinity ? 0 : minVal;
      }
      case 'MEDIAN': {
        const nums = extractFlatNumbers(args).sort((a, b) => a - b);
        if (nums.length === 0) return 0;
        const mid = Math.floor(nums.length / 2);
        return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      }
      case 'MODE': {
        const nums = extractFlatNumbers(args);
        const map = new Map<number, number>();
        let maxCount = 0;
        let mode = nums[0];
        nums.forEach((n) => {
          const count = (map.get(n) || 0) + 1;
          map.set(n, count);
          if (count > maxCount) {
            maxCount = count;
            mode = n;
          }
        });
        return mode;
      }
      case 'STDEV':
      case 'STDEVA': {
        const nums = extractFlatNumbers(args);
        if (nums.length < 2) return 0;
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        const sqDiff = nums.map((n) => Math.pow(n - avg, 2));
        return Math.sqrt(sqDiff.reduce((a, b) => a + b, 0) / (nums.length - 1));
      }
      case 'STDEVP': {
        const nums = extractFlatNumbers(args);
        if (nums.length === 0) return 0;
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        const sqDiff = nums.map((n) => Math.pow(n - avg, 2));
        return Math.sqrt(sqDiff.reduce((a, b) => a + b, 0) / nums.length);
      }
      case 'VAR': {
        const nums = extractFlatNumbers(args);
        if (nums.length < 2) return 0;
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        return nums.map((n) => Math.pow(n - avg, 2)).reduce((a, b) => a + b, 0) / (nums.length - 1);
      }
      case 'VARP': {
        const nums = extractFlatNumbers(args);
        if (nums.length === 0) return 0;
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        return nums.map((n) => Math.pow(n - avg, 2)).reduce((a, b) => a + b, 0) / nums.length;
      }
      case 'LARGE': {
        const nums = extractFlatNumbers([args[0]]).sort((a, b) => b - a);
        const k = Math.floor(parseNum(args[1])) - 1;
        return nums[k] !== undefined ? nums[k] : '#NUM!';
      }
      case 'SMALL': {
        const nums = extractFlatNumbers([args[0]]).sort((a, b) => a - b);
        const k = Math.floor(parseNum(args[1])) - 1;
        return nums[k] !== undefined ? nums[k] : '#NUM!';
      }
      case 'RANK': {
        const val = parseNum(args[0]);
        const list = extractFlatNumbers([args[1]]);
        const order = parseNum(args[2] || 0); // 0 desc, 1 asc
        const sorted = order === 0 ? list.sort((a, b) => b - a) : list.sort((a, b) => a - b);
        const idx = sorted.indexOf(val);
        return idx !== -1 ? idx + 1 : '#N/A';
      }
      case 'PERCENTILE': {
        const nums = extractFlatNumbers([args[0]]).sort((a, b) => a - b);
        const p = parseNum(args[1]);
        if (nums.length === 0 || p < 0 || p > 1) return '#NUM!';
        const idx = p * (nums.length - 1);
        const lower = Math.floor(idx);
        const upper = Math.ceil(idx);
        const weight = idx - lower;
        return nums[lower] * (1 - weight) + nums[upper] * weight;
      }
      case 'QUARTILE': {
        const q = Math.floor(parseNum(args[1]));
        const nums = extractFlatNumbers([args[0]]).sort((a, b) => a - b);
        if (q === 0) return nums[0];
        if (q === 4) return nums[nums.length - 1];
        if (q === 1) return executeExcelFunction('PERCENTILE', [nums, 0.25], rawArgNodes, currentRow, allRows, columns, rowIndex);
        if (q === 2) return executeExcelFunction('MEDIAN', [nums], rawArgNodes, currentRow, allRows, columns, rowIndex);
        if (q === 3) return executeExcelFunction('PERCENTILE', [nums, 0.75], rawArgNodes, currentRow, allRows, columns, rowIndex);
        return '#NUM!';
      }

      // --- LOGIKA & KONDISIONAL ---
      case 'IF': {
        const condition = args[0];
        const isTrue = condition === true || (typeof condition === 'number' && condition !== 0) || (typeof condition === 'string' && condition.toLowerCase() === 'true');
        return isTrue ? args[1] : args[2] !== undefined ? args[2] : false;
      }
      case 'IFS': {
        for (let i = 0; i < args.length; i += 2) {
          const cond = args[i];
          const isTrue = cond === true || (typeof cond === 'number' && cond !== 0) || (typeof cond === 'string' && cond.toLowerCase() === 'true');
          if (isTrue) {
            return args[i + 1];
          }
        }
        return '#N/A';
      }
      case 'AND': {
        for (const a of args) {
          if (!a || a === 'false' || a === 0) return false;
        }
        return true;
      }
      case 'OR': {
        for (const a of args) {
          if (a && a !== 'false' && a !== 0) return true;
        }
        return false;
      }
      case 'NOT':
        return !args[0];
      case 'XOR': {
        let trueCount = 0;
        for (const a of args) {
          if (a && a !== 'false' && a !== 0) trueCount++;
        }
        return trueCount % 2 !== 0;
      }
      case 'SWITCH': {
        const val = args[0];
        for (let i = 1; i < args.length - 1; i += 2) {
          if (String(val).toLowerCase() === String(args[i]).toLowerCase()) {
            return args[i + 1];
          }
        }
        return args.length % 2 === 0 ? args[args.length - 1] : '#N/A';
      }
      case 'IFERROR': {
        const v = args[0];
        if (v === undefined || v === null || String(v).startsWith('#')) {
          return args[1];
        }
        return v;
      }
      case 'IFNA': {
        const v = args[0];
        if (v === '#N/A' || v === undefined || v === null) {
          return args[1];
        }
        return v;
      }
      case 'ISBLANK': {
        const v = args[0];
        return v === null || v === undefined || v === '';
      }
      case 'ISNUMBER': {
        const v = args[0];
        return typeof v === 'number' && !isNaN(v);
      }
      case 'ISTEXT': {
        const v = args[0];
        return typeof v === 'string';
      }
      case 'ISERROR': {
        const v = args[0];
        return typeof v === 'string' && v.startsWith('#');
      }
      case 'TRUE':
        return true;
      case 'FALSE':
        return false;

      // --- TEKS & STRING ---
      case 'CONCAT':
      case 'CONCATENATE':
        return args.map((x) => (Array.isArray(x) ? x.join('') : String(x ?? ''))).join('');
      case 'TEXTJOIN': {
        const delim = String(args[0] ?? '');
        const ignoreEmpty = args[1] === true || String(args[1]).toLowerCase() === 'true';
        const parts: string[] = [];
        for (let i = 2; i < args.length; i++) {
          const item = args[i];
          if (Array.isArray(item)) {
            item.forEach((sub) => {
              const s = String(sub ?? '');
              if (!ignoreEmpty || s.trim() !== '') parts.push(s);
            });
          } else {
            const s = String(item ?? '');
            if (!ignoreEmpty || s.trim() !== '') parts.push(s);
          }
        }
        return parts.join(delim);
      }
      case 'LEFT': {
        const str = String(args[0] ?? '');
        const len = args[1] !== undefined ? parseNum(args[1]) : 1;
        return str.substring(0, len);
      }
      case 'RIGHT': {
        const str = String(args[0] ?? '');
        const len = args[1] !== undefined ? parseNum(args[1]) : 1;
        return str.substring(Math.max(0, str.length - len));
      }
      case 'MID': {
        const str = String(args[0] ?? '');
        const start = Math.max(1, parseNum(args[1])) - 1;
        const len = parseNum(args[2]);
        return str.substring(start, start + len);
      }
      case 'LEN':
        return String(args[0] ?? '').length;
      case 'TRIM':
        return String(args[0] ?? '').trim().replace(/\s+/g, ' ');
      case 'UPPER':
        return String(args[0] ?? '').toUpperCase();
      case 'LOWER':
        return String(args[0] ?? '').toLowerCase();
      case 'PROPER':
        return String(args[0] ?? '').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      case 'SUBSTITUTE': {
        const str = String(args[0] ?? '');
        const oldT = String(args[1] ?? '');
        const newT = String(args[2] ?? '');
        return str.split(oldT).join(newT);
      }
      case 'REPLACE': {
        const str = String(args[0] ?? '');
        const start = Math.max(1, parseNum(args[1])) - 1;
        const len = parseNum(args[2]);
        const rep = String(args[3] ?? '');
        return str.substring(0, start) + rep + str.substring(start + len);
      }
      case 'FIND': {
        const needle = String(args[0] ?? '');
        const haystack = String(args[1] ?? '');
        const start = Math.max(1, parseNum(args[2] || 1)) - 1;
        const idx = haystack.indexOf(needle, start);
        return idx !== -1 ? idx + 1 : '#VALUE!';
      }
      case 'SEARCH': {
        const needle = String(args[0] ?? '').toLowerCase();
        const haystack = String(args[1] ?? '').toLowerCase();
        const start = Math.max(1, parseNum(args[2] || 1)) - 1;
        const idx = haystack.indexOf(needle, start);
        return idx !== -1 ? idx + 1 : '#VALUE!';
      }
      case 'EXACT':
        return String(args[0] ?? '') === String(args[1] ?? '');
      case 'REPT': {
        const str = String(args[0] ?? '');
        const count = Math.max(0, Math.floor(parseNum(args[1])));
        return str.repeat(count);
      }
      case 'TEXT': {
        const val = parseNum(args[0]);
        const fmt = String(args[1] ?? '');
        if (fmt.includes('Rp') || fmt.includes('#,##0')) {
          return 'Rp ' + val.toLocaleString('id-ID');
        }
        return val.toLocaleString('id-ID');
      }
      case 'VALUE':
        return parseNum(args[0]);
      case 'CHAR':
        return String.fromCharCode(parseNum(args[0]));
      case 'CODE':
        return String(args[0] ?? '').charCodeAt(0) || 0;
      case 'CLEAN':
        return String(args[0] ?? '').replace(/[\x00-\x1F\x7F]/g, '');
      case 'T': {
        const v = args[0];
        return typeof v === 'string' ? v : '';
      }

      // --- LOOKUP & REFERENSI ---
      case 'VLOOKUP': {
        const lookupVal = String(args[0] ?? '').toLowerCase().trim();
        const targetColIdx = Math.max(1, Math.floor(parseNum(args[2]))) - 1;
        // Search in allRows
        for (const row of allRows) {
          const firstVal = String(row[columns[0]] ?? '').toLowerCase().trim();
          if (firstVal === lookupVal) {
            const retCol = columns[targetColIdx];
            return retCol ? row[retCol] : '#REF!';
          }
        }
        return '#N/A';
      }
      case 'XLOOKUP': {
        const lookupVal = String(args[0] ?? '').toLowerCase().trim();
        const lookupColNode = rawArgNodes[1];
        const lookupCol = lookupColNode && lookupColNode.type === 'Identifier' ? lookupColNode.name : columns[0];
        const matchedLookupCol = columns.find((c) => c.toLowerCase() === lookupCol.toLowerCase()) || lookupCol;

        const returnColNode = rawArgNodes[2];
        const returnCol = returnColNode && returnColNode.type === 'Identifier' ? returnColNode.name : columns[1] || columns[0];
        const matchedReturnCol = columns.find((c) => c.toLowerCase() === returnCol.toLowerCase()) || returnCol;

        const notFound = args[3] !== undefined ? args[3] : '#N/A';

        for (const row of allRows) {
          const cell = String(row[matchedLookupCol] ?? '').toLowerCase().trim();
          if (cell === lookupVal) {
            return row[matchedReturnCol];
          }
        }
        return notFound;
      }
      case 'INDEX': {
        const targetNode = rawArgNodes[0];
        const targetCol = targetNode.type === 'Identifier' ? targetNode.name : columns[0];
        const matchedCol = columns.find((c) => c.toLowerCase() === targetCol.toLowerCase()) || targetCol;
        const rowNum = Math.max(1, Math.floor(parseNum(args[1]))) - 1;
        const targetRow = allRows[rowNum];
        return targetRow && targetRow[matchedCol] !== undefined ? targetRow[matchedCol] : '#REF!';
      }
      case 'MATCH':
      case 'XMATCH': {
        const target = String(args[0] ?? '').toLowerCase().trim();
        const colNode = rawArgNodes[1];
        const colName = colNode && colNode.type === 'Identifier' ? colNode.name : columns[0];
        const matchedCol = columns.find((c) => c.toLowerCase() === colName.toLowerCase()) || colName;
        for (let i = 0; i < allRows.length; i++) {
          if (String(allRows[i][matchedCol] ?? '').toLowerCase().trim() === target) {
            return i + 1;
          }
        }
        return '#N/A';
      }
      case 'CHOOSE': {
        const idx = Math.floor(parseNum(args[0]));
        return args[idx] !== undefined ? args[idx] : '#VALUE!';
      }
      case 'ROW':
        return rowIndex + 1;
      case 'COLUMN':
        return 1;

      // --- TANGGAL & WAKTU ---
      case 'TODAY':
        return new Date().toISOString().split('T')[0];
      case 'NOW': {
        const d = new Date();
        return `${d.toISOString().split('T')[0]} ${d.toTimeString().split(' ')[0]}`;
      }
      case 'DATE': {
        const y = parseNum(args[0]);
        const m = parseNum(args[1]) - 1;
        const d = parseNum(args[2]);
        const dateObj = new Date(y, m, d);
        return dateObj.toISOString().split('T')[0];
      }
      case 'TIME': {
        const h = String(Math.floor(parseNum(args[0]))).padStart(2, '0');
        const m = String(Math.floor(parseNum(args[1]))).padStart(2, '0');
        const s = String(Math.floor(parseNum(args[2]))).padStart(2, '0');
        return `${h}:${m}:${s}`;
      }
      case 'YEAR': {
        const d = new Date(args[0]);
        return isNaN(d.getTime()) ? '#VALUE!' : d.getFullYear();
      }
      case 'MONTH': {
        const d = new Date(args[0]);
        return isNaN(d.getTime()) ? '#VALUE!' : d.getMonth() + 1;
      }
      case 'DAY': {
        const d = new Date(args[0]);
        return isNaN(d.getTime()) ? '#VALUE!' : d.getDate();
      }
      case 'HOUR': {
        const d = new Date(args[0]);
        if (!isNaN(d.getTime())) return d.getHours();
        const parts = String(args[0]).split(':');
        return parts.length >= 1 ? parseNum(parts[0]) : 0;
      }
      case 'MINUTE': {
        const d = new Date(args[0]);
        if (!isNaN(d.getTime())) return d.getMinutes();
        const parts = String(args[0]).split(':');
        return parts.length >= 2 ? parseNum(parts[1]) : 0;
      }
      case 'SECOND': {
        const d = new Date(args[0]);
        if (!isNaN(d.getTime())) return d.getSeconds();
        const parts = String(args[0]).split(':');
        return parts.length >= 3 ? parseNum(parts[2]) : 0;
      }
      case 'DAYS': {
        const d1 = new Date(args[0]).getTime();
        const d2 = new Date(args[1]).getTime();
        if (isNaN(d1) || isNaN(d2)) return '#VALUE!';
        return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
      }
      case 'DATEDIF': {
        const d1 = new Date(args[0]);
        const d2 = new Date(args[1]);
        const unit = String(args[2] ?? 'D').toUpperCase();
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '#VALUE!';
        const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (unit === 'Y') return Math.floor(diffDays / 365.25);
        if (unit === 'M') return Math.floor(diffDays / 30.4375);
        return diffDays;
      }
      case 'EDATE': {
        const d = new Date(args[0]);
        const m = parseNum(args[1]);
        if (isNaN(d.getTime())) return '#VALUE!';
        d.setMonth(d.getMonth() + m);
        return d.toISOString().split('T')[0];
      }
      case 'EOMONTH': {
        const d = new Date(args[0]);
        const m = parseNum(args[1]);
        if (isNaN(d.getTime())) return '#VALUE!';
        const endMonth = new Date(d.getFullYear(), d.getMonth() + m + 1, 0);
        return endMonth.toISOString().split('T')[0];
      }
      case 'WEEKDAY': {
        const d = new Date(args[0]);
        return isNaN(d.getTime()) ? '#VALUE!' : d.getDay() + 1; // 1 = Sunday
      }
      case 'WEEKNUM': {
        const d = new Date(args[0]);
        if (isNaN(d.getTime())) return '#VALUE!';
        const start = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
      }
      case 'NETWORKDAYS': {
        const d1 = new Date(args[0]);
        const d2 = new Date(args[1]);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '#VALUE!';
        let workDays = 0;
        const cur = new Date(d1);
        while (cur <= d2) {
          const day = cur.getDay();
          if (day !== 0 && day !== 6) workDays++;
          cur.setDate(cur.getDate() + 1);
        }
        return workDays;
      }
      case 'YEARFRAC': {
        const d1 = new Date(args[0]);
        const d2 = new Date(args[1]);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '#VALUE!';
        const days = Math.abs((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        return Number((days / 365.25).toFixed(4));
      }

      // --- FINANSIAL ---
      case 'PMT': {
        const rate = parseNum(args[0]);
        const nper = parseNum(args[1]);
        const pv = parseNum(args[2]);
        if (rate === 0) return -(pv / nper);
        const pmt = (rate * pv * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
        return -pmt;
      }
      case 'PV': {
        const rate = parseNum(args[0]);
        const nper = parseNum(args[1]);
        const pmt = parseNum(args[2]);
        if (rate === 0) return -pmt * nper;
        const pv = (pmt * (1 - Math.pow(1 + rate, -nper))) / rate;
        return -pv;
      }
      case 'FV': {
        const rate = parseNum(args[0]);
        const nper = parseNum(args[1]);
        const pmt = parseNum(args[2]);
        if (rate === 0) return -pmt * nper;
        const fv = (pmt * (Math.pow(1 + rate, nper) - 1)) / rate;
        return -fv;
      }
      case 'SLN': {
        const cost = parseNum(args[0]);
        const salvage = parseNum(args[1]);
        const life = parseNum(args[2]);
        return life > 0 ? (cost - salvage) / life : '#DIV/0!';
      }
      case 'SYD': {
        const cost = parseNum(args[0]);
        const salvage = parseNum(args[1]);
        const life = parseNum(args[2]);
        const per = parseNum(args[3]);
        if (life <= 0 || per <= 0 || per > life) return '#NUM!';
        const sum = (life * (life + 1)) / 2;
        return ((cost - salvage) * (life - per + 1)) / sum;
      }

      // --- INFORMASI & ERROR ---
      case 'ISNONTEXT':
        return typeof args[0] !== 'string';
      case 'ISODD':
        return Math.floor(Math.abs(parseNum(args[0]))) % 2 !== 0;
      case 'ISEVEN':
        return Math.floor(Math.abs(parseNum(args[0]))) % 2 === 0;
      case 'NA':
        return '#N/A';
      case 'TYPE': {
        const v = args[0];
        if (typeof v === 'number') return 1;
        if (typeof v === 'string') return v.startsWith('#') ? 16 : 2;
        if (typeof v === 'boolean') return 4;
        return 2;
      }
      case 'N': {
        const v = args[0];
        if (typeof v === 'number') return v;
        if (typeof v === 'boolean') return v ? 1 : 0;
        return 0;
      }

      default:
        return `#NAME? (${fn})`;
    }
  } catch (err: any) {
    return `#ERROR! (${err.message || 'eval error'})`;
  }
}

// Full evaluation wrapper
export function evaluateFormula(
  formulaStr: string,
  currentRow: DataRow,
  allRows: DataRow[],
  columns: string[],
  rowIndex = 0
): any {
  if (!formulaStr || !formulaStr.trim()) return '';
  const clean = formulaStr.trim();

  // If simple constant or no =
  if (!clean.startsWith('=')) {
    // Check if it's a direct column name
    const matchedCol = columns.find((c) => c.toLowerCase() === clean.toLowerCase());
    if (matchedCol && currentRow[matchedCol] !== undefined) {
      return currentRow[matchedCol];
    }
    return clean;
  }

  try {
    const tokens = tokenizeFormula(clean);
    const parser = new FormulaParser(tokens);
    const ast = parser.parse();
    return evaluateAST(ast, currentRow, allRows, columns, rowIndex);
  } catch (err: any) {
    return `#SYNTAX_ERR! ${err.message || ''}`;
  }
}
