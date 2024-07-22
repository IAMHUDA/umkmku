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


