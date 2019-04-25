// Toggle sidebar Navigation
(function() {
  function toggleSidebar(e) {
    e.preventDefault();
    const sideBar = document.getElementById("side-nav");
    sideBar.classList.toggle("side-active");
    sideBar.classList.toggle("side-hidden");
  }
  const menu = document.getElementById("nav-trigger");
  if (menu) {
    menu.addEventListener("click", toggleSidebar, false);
  }
})();
//Preview uploded image by the user
function showImage() {
  if (this.files && this.files[0]) {
    const obj = new FileReader();
    obj.onload = function(data) {
      const image = document.getElementById("image");
      image.src = data.target.result;
    };
    obj.readAsDataURL(this.files[0]);
  }
}

//Settings dropdown enabler
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

// Switch sidebar according to screen width(Using ccs media querry)

window.addEventListener("resize", function() {
  if (window.matchMedia("(min-width: 64.063em)").matches) {
    changeClassName();
  }
});
function changeClassName() {
  const clsName = document.getElementById("side-nav");

  if (clsName.length > 0) {
    clsName.className = "side-active side-nav";
  } else {
    clsName.className = "side-nav";
  }
}

// Toggle username, profile and logout

(function() {
  function toggleUserImg(e) {
    e.preventDefault();
    const nav_img = document.getElementById("dropdown-menu");

    nav_img.classList.toggle("drop-active");
    nav_img.classList.toggle("drop-hidden");
  }
  const img = document.getElementById("user-img");
  if (img) {
    img.addEventListener("click", toggleUserImg, false);
  }
})();
