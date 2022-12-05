"use strict";
const nav = document.getElementById("nav");
const form = document
  .getElementById("filter-form")
  .addEventListener("submit", (e) => handleFilterForm(e));
const body = document.querySelector("body");
const loading = document.querySelector(".lds-hourglass");
const paginatorContainer = document.querySelector(".paginator");
const nextBtn = document.getElementById("next");
nextBtn.addEventListener("click", nextPage);
const prevBtn = document.getElementById("prev");
prevBtn.addEventListener("click", prevPage);

const btn = document.querySelector("button");
const cardsContainer = document.getElementById("card-container");
btn.addEventListener("click", loadingMsg);
let base_url = "https://rickandmortyapi.com/api/character";
let data = [];

function handleFilterForm(e) {
  base_url = "https://rickandmortyapi.com/api/character";
  let querySegment = "?";
  e.preventDefault();
  const data = new FormData(e.target);
  const status = data.get("status");
  const gender = data.get("gender");
  if (!status && !gender) return;
  if (status && !gender) {
    querySegment += `status=${status}`;
  } else if (gender && !status) {
    querySegment += `gender=${gender}`;
  } else {
    querySegment += `status=${status}&gender=${gender}`;
  }
  clearPage();
  console.log(querySegment);
  handleGetData(querySegment);
}

function loadingMsg(delay) {
  btn.classList.add("hidden");
  loading.classList.remove("hidden");
  setTimeout(() => {
    loading.classList.add("hidden");
    handleGetData();
  }, delay);
}

const handleGetData = async (endpoint = "") => {
  try {
    const res = await fetch(base_url + endpoint);
    const personajes = await res.json();
    data = personajes;
    renderData(personajes);
  } catch (error) {
    console.log(error);
  }
};

function renderData(data) {
  nav.classList.remove("hidden");
  data.results.forEach((element) => {
    const cardBody = document.createElement("div");
    cardBody.classList.add("card");
    cardBody.innerHTML = `
    <div class="img-container">
    <img src="${element.image}" alt="${element.name}">
    </div>
    <h2>${element.name}</h2>    
    <p>Species: ${element.species}</p>
    <p>Status: ${element.status}</p>
    <p>Geder: ${element.gender}</p>
    
    `;
    cardsContainer.appendChild(cardBody);
  });
  paginator(data.info.prev, data.info.next);
}

function paginator(prev, next) {
  paginatorContainer.classList.remove("hidden");
  !prev
    ? prevBtn.setAttribute("disabled", true)
    : prevBtn.removeAttribute("disabled");
  !next
    ? nextBtn.setAttribute("disabled", true)
    : nextBtn.removeAttribute("disabled");
}

function nextPage() {
  base_url = data.info.next;
  clearPage();
  loadingMsg(500);
}

function prevPage() {
  base_url = data.info.prev;
  clearPage();
  loadingMsg(500);
  handleGetData();
}

function clearPage() {
  cardsContainer.querySelectorAll("*").forEach((card) => card.remove());
}
