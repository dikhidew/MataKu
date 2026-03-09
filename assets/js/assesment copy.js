// ========================
// DATA PERTANYAAN (OSDI)
// ========================
const questions = [
  // Bagian A
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "1. Apakah mata Anda terasa sensitif terhadap cahaya?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "2. Apakah mata terasa berpasir/mengganjal?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "3. Apakah mata terasa sakit atau perih?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "4. Apakah penglihatan Anda kabur?" },
  { cat: "A. Gejala Mata (Dalam 1 minggu terakhir)", text: "5. Apakah penglihatan Anda buruk?" },
  // Bagian B
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "6. Membaca?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "7. Mengemudi di malam hari?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "8. Bekerja dengan komputer atau mesin ATM?" },
  { cat: "B. Keterbatasan Aktivitas (Apakah membatasi Anda saat):", text: "9. Menonton TV?" },
  // Bagian C
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "10. Kondisi berangin?" },
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "11. Berada di tempat dengan kelembapan rendah (sangat kering)?" },
  { cat: "C. Ketidaknyamanan Lingkungan (Apakah mata terasa tidak nyaman saat):", text: "12. Berada di area ber-AC?" }
];

// ========================
// STATE (Kondisi Saat Ini)
// ========================
let currentQuestion = 0;
let totalScoreD = 0;        // D: Jumlahkan semua skor
let answeredQuestionsE = 0; // E: Total pertanyaan yang dijawab (tanpa N/A)

// ========================
// ELEMENT SESUAI HTML
// ========================
const categoryElem = document.getElementById("formCategory");
const heading = document.getElementById("formHeading");
const buttons = document.querySelectorAll(".btn-osdi");

// ========================
// TAMPILKAN SOAL
// ========================
function showQuestion() {
  categoryElem.textContent = questions[currentQuestion].cat;
  heading.textContent = questions[currentQuestion].text;
}

// ========================
// FUNGSI KETIKA MENJAWAB
// ========================
function answer(scoreValue) {
  // Hitung skor hanya jika jawaban BUKAN N/A
  if (scoreValue !== "NA") {
    totalScoreD += parseInt(scoreValue);
    answeredQuestionsE++;
  }

  currentQuestion++;

  // Cek Transisi Antar Bagian
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

// ========================
// CEK PERTANYAAN SELANJUTNYA / HASIL
// ========================
function checkNext() {
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// ========================
// EVENT LISTENER
// ========================
buttons.forEach(btn => {
  btn.addEventListener("click", function () {
    const score = this.getAttribute("data-score");
    answer(score);
  });
});

// ========================
// HASIL INTERPRETASI (OSDI)
// ========================
function showResult() {
  // Jika semua dijawab N/A, rumus tidak bisa dihitung (dibagi 0)
  if (answeredQuestionsE === 0) {
    Swal.fire({
      title: "Hasil Tidak Valid",
      text: "Anda menjawab N/A pada semua pertanyaan. Indeks OSDI tidak dapat dihitung.",
      icon: "warning",
      confirmButtonText: "Ulangi Asesmen"
    }).then(() => resetAssessment());
    return;
  }

  // Rumus: Skor Akhir = (D * 25) / E
  const finalScore = (totalScoreD * 25) / answeredQuestionsE;
  const scoreRounded = finalScore.toFixed(1);

  let title = "";
  let desc = "";
  let resultIcon = "info";

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

  Swal.fire({
    title: title,
    html: `
      <p style="text-align:center; font-size:16px; margin-bottom: 15px;">${desc}</p>
      <hr>
      <small>Total Skor: ${totalScoreD} | Pertanyaan Dijawab: ${answeredQuestionsE}</small>
    `,
    icon: resultIcon,
    showCancelButton: true,
    confirmButtonText: "Selesai",
    cancelButtonText: "Cek Referensi Dokter",
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      // Jika klik "Cek Referensi Dokter", Anda bisa ubah link ini sesuai kebutuhan proyek
      window.location.href = "../display/KesehatanMata.html"; 
    } else {
      // Jika klik "Selesai"
      resetAssessment();
    }
  });
}

// ========================
// RESET ULANG
// ========================
function resetAssessment() {
  currentQuestion = 0;
  totalScoreD = 0;
  answeredQuestionsE = 0;
  showQuestion();
}

// ========================
// LOAD AWAL
// ========================
showQuestion();