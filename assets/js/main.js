// add hovered class to selected list item



let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

document.addEventListener("DOMContentLoaded", function() {
  let currentUrl = window.location.href;

  let navigationLinks = document.querySelectorAll(".navigation li a");

  navigationLinks.forEach(function(link) {
      if(link.href === currentUrl) {
          link.parentElement.classList.add("active");
      } else {
          link.parentElement.classList.remove("active"); // Hapus kelas "active" dari item navigasi yang tidak sesuai
      }
  });
});


// tambahan

document.addEventListener('DOMContentLoaded', () => {
  const logos = document.querySelectorAll('.tech-logo');
  logos.forEach(logo => {
      logo.addEventListener('click', () => {
          alert(`Anda mengklik logo ${logo.alt.split(' ')[0]}!`);
      });
  });
});


function show1() {
  Swal.fire({
    title: "<strong>game</strong>",
    html: `
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div style="text-align: center;">
          <img src="./assets/imgs/valo.jpeg" alt="Valorant" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>Valorant</p>
        </div>
        <div style="text-align: center;">
          <img src="./assets/imgs/ml.jpg" alt="Mobile Legends" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>Mobile Legends</p>
        </div>
        <div style="text-align: center;">
          <img src="./assets/imgs/ff.png" alt="Free Fire" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>Free Fire</p>
        </div>
      </div>
    `,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Like
    `,
    confirmButtonAriaLabel: "Like"
  });
}

function show2() {
  Swal.fire({
    title: "<strong>game</strong>",
    html: `
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div style="text-align: center;">
          <img src="./assets/imgs/futsal.jpeg" alt="futsal" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>futsal</p>
        </div>
        <div style="text-align: center;">
          <img src="./assets/imgs/basket.jpeg" alt="basket" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>basket</p>
        </div>
        <div style="text-align: center;">
          <img src="./assets/imgs/renang.jpg" alt="renang" style="width: 100px; height: 100px; display: block; margin: 0 auto 10px;">
          <p>renang</p>
        </div>
      </div>
    `,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Like
    `,
    confirmButtonAriaLabel: "Like"
  });
}

function show3() {
  Swal.fire({
    title: "<strong>Music Playlist</strong>",
    html: `
      <div style="text-align: center;">
        <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    `,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Like
    `,
    confirmButtonAriaLabel: "Like"
  });
}

function show4(){
Swal.fire({
  title: "Submit your Github username",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  showCancelButton: true,
  confirmButtonText: "Look up",
  showLoaderOnConfirm: true,
  preConfirm: async (login) => {
    try {
      const githubUrl = `
        https://api.github.com/users/${login}
      `;
      const response = await fetch(githubUrl);
      if (!response.ok) {
        return Swal.showValidationMessage(`
          ${JSON.stringify(await response.json())}
        `);
      }
      return response.json();
    } catch (error) {
      Swal.showValidationMessage(`
        Request failed: ${error}
      `);
    }
  },
  allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: `${result.value.login}'s avatar`,
      imageUrl: result.value.avatar_url
    });
  }
});
}