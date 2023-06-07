document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("famouse-container").style.display = "none";
  document.getElementById("newbies-container").style.display = "block";
});

document.querySelector('.newbies').addEventListener('click',
  function () {
    document.getElementById("newbies-container").style.display = "block";
    document.getElementById("famouse-container").style.display = "none";
  });
  
document.querySelector('.famouse').addEventListener('click',
  function () {
    document.getElementById("newbies-container").style.display = "none";
    document.getElementById("famouse-container").style.display = "block";
  });


document.querySelector('.more-info').addEventListener('click', function(){
  document.querySelector('.about').classList.toggle('active');
});
