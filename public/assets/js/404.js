// JS for the 404 page
const goBackBtn = document.getElementById('back');

const goBack = (e) => {
  e.preventDefault();
// once click on the goBackBtn, the page will go to the main page
e.onClick=window.location.replace('http://localhost:3001');
}

goBackBtn.addEventListener('click', goBack);
