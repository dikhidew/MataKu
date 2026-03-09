// ========================
// DATA PERTANYAAN (OSDI)
// ========================
const questions = [
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "1. Apakah mata Anda terasa sensitif terhadap cahaya?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "2. Apakah mata terasa berpasir/mengganjal?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "3. Apakah mata terasa sakit atau perih?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "4. Apakah penglihatan Anda kabur?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "5. Apakah penglihatan Anda buruk?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "6. Membaca?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "7. Mengemudi di malam hari?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "8. Bekerja dengan komputer atau mesin ATM?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "9. Menonton TV?" },
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "10. Kondisi berangin?" },
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "11. Berada di tempat dengan kelembapan rendah (sangat kering)?" },
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "12. Berada di area ber-AC?" }
];

// ========================
// STATE (Kondisi Saat Ini)
// ========================
let currentQuestion = 0;
let totalScoreD = 0;        // D = Jumlah skor dari semua pertanyaan yang dijawab
let answeredQuestionsE = 0; // E = Jumlah total pertanyaan yang dijawab

// ========================
// EVENT DELEGATION (Menjamin Tombol Pasti Bisa Diklik)
// ========================
document.addEventListener("click", function(event) {
  const btn = event.target.closest('.btn-osdi');
  if (btn) {
    event.preventDefault(); 
    const scoreValue = btn.getAttribute("data-score");
    answer(scoreValue);
  }
});

// ========================
// TAMPILKAN SOAL
// ========================
function showQuestion() {
  const categoryElem = document.getElementById("formCategory");
  const heading = document.getElementById("formHeading");
  
  if (categoryElem && heading) {
    categoryElem.textContent = questions[currentQuestion].cat;
    heading.textContent = questions[currentQuestion].text;
  }
}

// ========================
// FUNGSI KETIKA MENJAWAB
// ========================
function answer(scoreValue) {
  // Hanya hitung skor & tambah jumlah terjawab JIKA opsi yang dipilih BUKAN N/A
  if (scoreValue !== "NA") {
    totalScoreD += parseInt(scoreValue);
    answeredQuestionsE++;
  }

  currentQuestion++;

  // Cek Transisi Antar Bagian dengan SweetAlert
  if (currentQuestion === 5) {
    Swal.fire({
      title: "Bagian A Selesai",
      text: "Selanjutnya, mari evaluasi keterbatasan aktivitas Anda.",
      icon: "info",
      confirmButtonText: "Lanjut Bagian B",
      confirmButtonColor: "#007bff"
    }).then(() => checkNext());
  } else if (currentQuestion === 9) {
    Swal.fire({
      title: "Bagian B Selesai",
      text: "Terakhir, mari evaluasi ketidaknyamanan lingkungan.",
      icon: "info",
      confirmButtonText: "Lanjut Bagian C",
      confirmButtonColor: "#007bff"
    }).then(() => checkNext());
  } else {
    checkNext();
  }
}

function checkNext() {
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// ========================
// HASIL INTERPRETASI (OSDI)
// ========================
function showResult() {
  // Validasi: Jika user menekan N/A di SEMUA pertanyaan
  if (answeredQuestionsE === 0) {
    Swal.fire({
      title: "Hasil Tidak Valid",
      text: "Anda menjawab N/A pada semua pertanyaan. Indeks OSDI tidak dapat dihitung.",
      icon: "warning",
      confirmButtonText: "Ulangi Asesmen"
    }).then(() => resetAssessment());
    return;
  }

  // === RUMUS PERHITUNGAN SESUAI REFERENSI ===
  // (Skor D x 25) dibagi Jumlah Pertanyaan Terjawab (E)
  const finalScore = (totalScoreD * 25) / answeredQuestionsE;
  const scoreRounded = finalScore.toFixed(1); // Dibulatkan 1 angka di belakang koma

  let title = "";
  let desc = "";
  let resultIcon = "info";

  // === PARAMETER KLASIFIKASI SESUAI GAMBAR ===
  if (finalScore >= 0 && finalScore <= 12) {
    title = `Normal (Skor: ${scoreRounded}) ⭐`;
    desc = "Kondisi permukaan mata Anda sehat (Normal). Terus pertahankan kebiasaan baik Anda, seperti mengistirahatkan mata saat bekerja di depan layar dan menggunakan pelindung mata saat berada di luar ruangan.";
    resultIcon = "success";
  } else if (finalScore > 12 && finalScore <= 22) {
    title = `Mild / Ringan (Skor: ${scoreRounded}) 💧`;
    desc = "Terdapat gejala mata kering ringan. Mulailah lebih sering mengistirahatkan mata (terapkan aturan 20-20-20), perbanyak minum air putih, dan hindari paparan AC/angin secara langsung ke arah mata.";
    resultIcon = "info";
  } else if (finalScore > 22 && finalScore <= 32) {
    title = `Moderate / Sedang (Skor: ${scoreRounded}) ⚠️`;
    desc = "Gejala mata kering tingkat sedang. Disarankan untuk mulai menggunakan obat tetes mata pelumas (air mata buatan) yang dijual bebas, dan hindari lingkungan yang terlalu kering atau berangin.";
    resultIcon = "warning";
  } else {
    title = `Severe / Berat (Skor: ${scoreRounded}) 🛑`;
    desc = "Gejala mata kering berat! Sangat disarankan untuk segera berkonsultasi dengan dokter spesialis mata untuk mendapatkan penanganan medis yang tepat. Jangan menunda pemeriksaan.";
    resultIcon = "error";
  }

  // Tampilkan Pop-Up Hasil Akhir
  Swal.fire({
    title: title,
    html: `
      <p style="text-align:center; font-size:16px; margin-bottom: 15px;">${desc}</p>
      <hr>
      <small>
        <b>Rincian Perhitungan:</b><br>
        Total Skor (D) = <b>${totalScoreD}</b><br>
        Pertanyaan Dijawab (E) = <b>${answeredQuestionsE}</b>
      </small>    
    `,
    icon: resultIcon,
    showCancelButton: true,
    confirmButtonText: "Selesai",
    cancelButtonText: "Cek Referensi Dokter",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#007bff"
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.location.href = "../display/dokter.html"; 
    } else {
      resetAssessment();
    }
  });
}

// ========================
// RESET ULANG ASESMEN
// ========================
function resetAssessment() {
  currentQuestion = 0;
  totalScoreD = 0;
  answeredQuestionsE = 0;
  showQuestion();
}

// ========================
// LOAD AWAL SAAT DOM SIAP
// ========================
document.addEventListener('DOMContentLoaded', showQuestion);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  showQuestion();
}