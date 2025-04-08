import { API_URL } from "../api/api.js";

const characterContainer = document.getElementById("character-container");
const statusFilter = document.getElementById("statusFilter");
const filterButton = document.getElementById("filterButton");
const paginationContainer = document.getElementById("pagination-container");
const modal = document.getElementById("character-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.querySelector(".close");

let currentPage = 1;
let totalPages = 1;

// Solo filtramos por status ahora
async function fetchCharacters(page = 1, status = "all") {
  let url = `${API_URL}?page=${page}`;
  if (status !== "all" && status !== "") {
    url += `&status=${status}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    totalPages = data.info.pages;
    renderCharacters(data.results);
    renderPagination();
  } catch (error) {
    console.error("Error al obtener los personajes:", error);
    characterContainer.innerHTML = "<p>No se encontraron personajes.</p>";
    paginationContainer.innerHTML = "";
  }
}

function crearTarjeta(personaje) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "character-card";

  tarjeta.innerHTML = `
    <img src="${personaje.image}" alt="${personaje.name}">
    <h2>${personaje.name}</h2>
    <p><strong>Status:</strong> ${personaje.status}</p>
    <p><strong>Species:</strong> ${personaje.species}</p>
  `;

  tarjeta.addEventListener("click", () => showModal(personaje));

  return tarjeta;
}

function renderCharacters(characters) {
  characterContainer.innerHTML = "";
  characters.forEach((character) => {
    const card = crearTarjeta(character);
    characterContainer.appendChild(card);
  });
}

function showModal(character) {
  modalBody.innerHTML = `
    <h2 style="color: #00ffcc">${character.name}</h2>
    <img src="${character.image}" alt="${character.name}">
    <p><strong>Status:</strong> ${character.status}</p>
    <p><strong>Species:</strong> ${character.species}</p>
    <p><strong>Origin:</strong> ${character.origin.name}</p>
  `;
  modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Solo usamos status
filterButton.addEventListener("click", () => {
  currentPage = 1;
  fetchCharacters(currentPage, statusFilter.value);
});

function renderPagination() {
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCharacters(currentPage, statusFilter.value);
    }
  });

  const pageDisplay = document.createElement("span");
  pageDisplay.textContent = `Página ${currentPage} de ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchCharacters(currentPage, statusFilter.value);
    }
  });

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pageDisplay);
  paginationContainer.appendChild(nextButton);
}

// Al cargar, mostramos todos
fetchCharacters();
