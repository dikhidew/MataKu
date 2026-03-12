// ========================
// DATA PERTANYAAN ISHIHARA
// ========================
const ishiharaData = [
  { img: '1.png', answer: 12 },
  { img: '2.png', answer: 8 },
  { img: '3.png', answer: 29 },
  { img: '4.png', answer: 5 },
  { img: '5.png', answer: 3 },
  { img: '6.png', answer: 15 },
  { img: '7.png', answer: 74 },
  { img: '8.png', answer: 6 },
  { img: '9.png', answer: 45 },
  { img: '10.png', answer: 5 },
  { img: '11.png', answer: 7 },
  { img: '12.png', answer: 16 },
  { img: '13.png', answer: 73 },
  { img: '14.png', answer: 26 }
];

// ========================
// STATE (Kondisi Saat Ini)
// ========================
let currentQuestion = 0;
let score = 0; 

// ========================
// INISIALISASI ELEMEN
// ========================
const imgElement = document.getElementById('ishihara-img');
const inputElement = document.getElementById('ishihara-input');
const headingElement = document.getElementById('formHeading');
const btnSubmit = document.getElementById('btn-submit-answer');

// Membatasi Input Hanya Angka & Maksimal 2 Digit
inputElement.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 2);
});

// Deteksi tombol 'Enter' pada keyboard untuk submit cepat
inputElement.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitAnswer();
  }
});

btnSubmit.addEventListener('click', submitAnswer);

// ========================
// TAMPILKAN SOAL
// ========================
function showQuestion() {
  const currentData = ishiharaData[currentQuestion];
  
  // Ubah Gambar & Heading
  headingElement.textContent = `Gambar ${currentQuestion + 1} dari ${ishiharaData.length}`;
  imgElement.src = `../assets/img/img/colorblind/${currentData.img}`;
  
  // Kosongkan dan fokuskan input
  inputElement.value = '';
  inputElement.focus();
}

// ========================
// PROSES JAWABAN
// ========================
function submitAnswer() {
  let userAnswer = inputElement.value.trim();
  
  // Jika input kosong, paksa isi
  if (userAnswer === "") {
    Swal.fire({
      icon: 'warning',
      title: 'Tunggu Dulu!',
      text: 'Mohon masukkan angka yang Anda lihat. Jika tidak melihat apa-apa, ketik 0.'
    });
    return;
  }

  // Cek Kebenaran (Konversi input ke number agar perbandingan akurat)
  const correctAnswer = ishiharaData[currentQuestion].answer;
  const isCorrect = parseInt(userAnswer) === correctAnswer;

  if (isCorrect) {
    score++; // Tambah 1 poin
    Swal.fire({
      title: "Benar!",
      text: "Tebakan Anda tepat.",
      icon: "success",
      confirmButtonText: "Lanjut",
      confirmButtonColor: "#28a745"
    }).then(() => checkNext());
  } else {
    Swal.fire({
      title: "Salah!",
      text: `Anda menjawab ${userAnswer}. Jawaban yang benar adalah ${correctAnswer}.`,
      icon: "error",
      confirmButtonText: "Lanjut",
      confirmButtonColor: "#007bff"
    }).then(() => checkNext());
  }
}

function checkNext() {
  currentQuestion++;
  if (currentQuestion < ishiharaData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// ========================
// HASIL AKHIR TES
// ========================
function showResult() {
  let title = "";
  let desc = "";
  let resultIcon = "";

  // Penilaian: 12-14 (Normal), 0-11 (Indikasi Colorblind)
  if (score >= 12 && score <= 14) {
    title = `Normal (Skor: ${score}/14)`;
    desc = "Berdasarkan tes Ishihara, penglihatan warna Anda terindikasi <b>Normal</b>. Anda dapat membedakan spektrum warna dengan baik.";
    resultIcon = "success";
  } else {
    title = `Indikasi Buta Warna (Skor: ${score}/14)`;
    desc = "Berdasarkan tes ini, terdapat indikasi <b>Buta Warna (Defisiensi Penglihatan Warna)</b>. Sangat disarankan untuk berkonsultasi lebih lanjut ke Dokter Spesialis Mata untuk pemeriksaan diagnosis yang lebih akurat.";
    resultIcon = "warning";
  }

  Swal.fire({
    title: title,
    html: `
      <p style="font-size:16px; margin-bottom: 15px;">${desc}</p>
      <hr>
      <small>Total Jawaban Benar: <b>${score} dari 14</b></small>
    `,
    icon: resultIcon,
    showCancelButton: true,
    confirmButtonText: "Selesai",
    cancelButtonText: "Cek Referensi Dokter",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#007bff",
    allowOutsideClick: false
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.location.href = "../display/KesehatanMata.html"; // Ubah sesuai dengan halaman dokter yang ada
    } else {
      resetTest();
    }
  });
}

// ========================
// RESET TES
// ========================
function resetTest() {
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

// ========================
// LOAD AWAL SAAT DOM SIAP
// ========================
document.addEventListener('DOMContentLoaded', showQuestion);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  showQuestion();
}