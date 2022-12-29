const templateVideo = `
    <h2 class="video_title">Partage d'ecran Google meet avec Studi</h2>
    <video width="320" height="240" controls>
      <source src="" type="video/mp4" />
    </video>
`;

const number_download = document.querySelector(".number_download")


const container = document.querySelector(".container_divers");
const medias = "https://dev-passion76.fr/tuto_studi/uploads/";

let fileSelected = "";
const addtuto = document.querySelector("#addtuto");
const container_form = document.querySelector(".container_form");
const close = document.querySelector(".close");

addtuto.addEventListener("click", display_form);
close.addEventListener("click", display_form);

const formFile = document.querySelector("#formFile");
formFile.addEventListener("change", changeFile);

function changeFile(e) {
  fileSelected = e.target.files[0].name;
  findtuto();
}

function display_form() {
  overlay.classList.toggle("hide_form");
  container_form.classList.toggle("hide_form");
}

const container_link = document.querySelector(".nav");
const overlay = document.querySelector(".overlay");
const menu = document.querySelector(".menu");
menu.addEventListener("click", () => {
  container_link.classList.toggle("display_menu");
});

async function fileUpload(formElement) {
  if (fileSelected == "") {
    alert(
      "Merci de sélectionner un fichier Valid \n Fichier Vidéo MP4 5Mo maximum \n les doublons sont interdits"
    );
    return;
  }

  const formData = new FormData(formElement);

  number_download.innerHTML = +number_download.innerHTML + 1
  number_download.classList.add("animNumberDownload")
  display_form()

  await fetch("https://dev-passion76.fr:3004/upload/addfile", {
    method: "POST",
    body: formData,
    dataType: "jsonp",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 200) {
        successCB(data);
      } else {
        ErrorCB(data);
      }
    });
}

function successCB(res) {
  Addtuto(res.originalname, res.filename);
  number_download.innerHTML = +number_download.innerHTML - 1
  if (number_download.innerHTML == 0)
  {
    number_download.classList.remove("animNumberDownload")
  }
  alert(`ajout OK`);
  fileSelected = "";
}

function ErrorCB(data) {
  number_download.innerHTML = +number_download.innerHTML - 1
  if (number_download.innerHTML == 0)
  {
    number_download.classList.remove("animNumberDownload")
  }
  alert(`Echec de l'ajout \n ${data.message}`);
  fileSelected = "";
}

async function findtuto() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    originalname: fileSelected,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://dev-passion76.fr:3004/upload/FindTuto", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.statusCode);
      if (result.statusCode == 200) {
        fileSelected = "";
        console.log("tuto déja existant");
        alert("tuto déja existant");
      }
    })
    .catch((error) => {
      fileSelected = "";
      console.log("error server");
    });
}

async function listAllTuto() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://dev-passion76.fr:3004/upload/ListeFile", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((tuto) => {
        console.log(tuto);
        Addtuto(tuto.tutoname, tuto.filename);
      });
    })
    .catch((error) => console.log("error", error));
}

function Addtuto(title, src) {
  const tuto = templateVideo;

  const card = document.createElement("div");
  card.setAttribute("class", "container_video");
  card.innerHTML = tuto;
  card.querySelector(".video_title").innerHTML = title;
  card.querySelector("source").src = medias + src;

  container.appendChild(card);
}

listAllTuto();

