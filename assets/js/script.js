//PEEPAL

document.getElementById('evaluationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Menghentikan pengiriman formulir default

  // Ambil nilai dari formulir
  var name = document.getElementById('fname').value;
  var rating = parseInt(document.getElementById('rating').value);

  // Validasi jika form belum lengkap
  if (name === '' || isNaN(rating) || rating === 0) {
    alert('Please fill in all fields.');
    return;
  }

  // Menentukan hasil berdasarkan rating
  var resultMessage = '';
  var recommendation = '';
  var iconType = ''; // Variabel untuk menentukan ikon (centang atau silang)
  var resultTitle = ''; // Variabel untuk menyesuaikan judul

  // Menentukan pesan berdasarkan rating
  switch (rating) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      resultMessage = '<b>' + name + '</b>, Kamu sudah minum sebanyak <b>' + rating + '</b>x hari ini dan itu';
      recommendation = 'Sangat kurang. Rehidrasi tubuh sesuai dengan anjuran minimal <b>1,5 Liter</b>.';
      iconType = 'error'; // Simbol X
      resultTitle = 'Sangat kurang'; // Judul berdasarkan rating
      break;
    case 6:
    case 7:
    case 8:
      resultMessage = '<b>' + name + '</b>, Kamu sudah minum sebanyak <b>' + rating + '</b>x hari ini dan itu';
      recommendation = 'Kurang. Rehidrasi tubuh sesuai dengan anjuran minimal <b>1,5 Liter</b>.';
      iconType = 'error'; // Simbol X
      resultTitle = 'Kurang'; // Judul berdasarkan rating
      break;
    case 9:
    case 10:
      resultMessage = '<b>' + name + '</b>, Kamu sudah minum sebanyak <b>' + rating + '</b>x hari ini dan itu sudah';
      recommendation = 'Sesuai. Hidrasi tubuhmu sesuai anjuran.';
      iconType = 'success'; // Simbol centang
      resultTitle = 'Sesuai'; // Judul berdasarkan rating
      break;
    default:
      resultMessage = 'Invalid rating';
      recommendation = '';
      iconType = 'error'; // Simbol X
      resultTitle = 'Invalid Rating'; // Judul jika rating invalid
  }

  // Menggunakan SweetAlert2 untuk menampilkan pop-up
  Swal.fire({
    title: resultTitle, // Menampilkan judul sesuai rating
    html: resultMessage + ' ' + recommendation, // Mendukung HTML
    icon: iconType, // Icon sesuai hasil
    showCancelButton: true, // Aktifkan tombol kedua
    confirmButtonText: 'OK',
    cancelButtonText: 'Pelajari lebih lanjut'
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      // Jika klik "Pelajari lebih lanjut"
      window.location.href = "../display/SiKandung.html";
    }
  });

});

// Event listener untuk tombol "Kembali" - Arahkan ulang ke halaman formHydraTrack.html
document.getElementById('backButton').addEventListener('click', function() {
  window.location.href = "formHydraTrack.html"; // Arahkan ke halaman formHydraTrack.html
});



//HYDRATRACK

// Function to display the SweetAlert2 based on the color
function showAlert(color) {
  let message = '';
  
  // Define messages for each color
  switch(color) {
    case 'Kuning pekat':
      message = 'Anda butuh sangat banyak minum. Segera hidrasi tubuh anda, tambah minimal 8 gelas mineral!';
      break;
    case 'Kuning muda':
      message = 'Anda butuh banyak minum. Segera hidrasi tubuh anda, tambah minimal 4 gelas mineral!';
      break;
    case 'Kuning Bening':
      message = 'Jumlah minum anda sudah baik. Sesuaikan dengan kebutuhan minum harian anda.';
      break;
    case 'Bening':
      message = 'Jumlah minum anda sudah tercukupi. Sesuaikan dengan kebutuhan minum harian anda.';
      break;
    case 'Merah':
      message = 'Terdapat beberapa kemungkinan: \nTerdapat darah dalam urin anda, segera periksakan ke dokter. \nAnda sedang meminum obat-obatan';
      break;
    case 'Hijau/Biru':
      message = 'Terdapat efek dari makanan/obat-obatan yang sedang anda konsumsi';
      break;
    case 'Oranye':
      message = 'Terdapat beberapa kemungkinan: \nDapat mengindikasikan masalah hati atau masalah saluran empedu. \nTerdapat efek dari makanan/obat-obat yang sedang anda konsumsi';
      break;
    case 'Berbusa/Berbuih Banyak':
      message = 'Terdapat masalah pada ginjal anda, segera periksakan ke dokter!';
      break;
    default:
      message = 'Warna pipis tidak teridentifikasi.';
  }

  // Show SweetAlert2
  Swal.fire({
    title: color,
    text: message,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Pelajari lebih lanjut'
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.location.href = "../display/SiKandung.html";
    }
  });

}


