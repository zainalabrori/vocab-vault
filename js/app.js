// js/app.js

// Load components dynamically
let wordCardTemplate = "";
let editingWordId = null; // null = not editing

async function loadComponent(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;

  if (id === "modal") {
    bindFormEvents(); // re-bind form after loading modal
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "components/navbar.html");
  loadComponent("modal", "components/add-word-form.html");
  loadWords();
});

function openModal() {
  document.getElementById("addModal")?.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("addModal")?.classList.add("hidden");
  editingWordId = null;
  document.getElementById("modalTitle").textContent = "Add New Word";
  document.getElementById("submitBtn").textContent = "Add Word";
}

// Bind form submit to save word
function bindFormEvents() {
  const form = document.getElementById("add-word-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // const inputs = form.querySelectorAll("input, select");
    // const [wordInput, defInput, exampleInput, typeSelect] = inputs;

    const [wordInput, defInput, exampleInput, typeSelect] =
      form.querySelectorAll("input, select");
    const words = JSON.parse(localStorage.getItem("vocabWords") || "[]");

    // const word = {
    //   id: Date.now(),
    //   text: wordInput.value,
    //   definition: defInput.value,
    //   example: exampleInput.value,
    //   type: typeSelect.value,
    //   date: new Date().toLocaleDateString("en-GB", {
    //     day: "2-digit",
    //     month: "short",
    //     year: "numeric",
    //   }), // e.g., "22 May 2025"
    // };

    if (editingWordId) {
      // ✅ Edit mode
      const index = words.findIndex((w) => w.id == editingWordId);
      if (index !== -1) {
        words[index] = {
          ...words[index],
          text: wordInput.value,
          definition: defInput.value,
          example: exampleInput.value,
          type: typeSelect.value,
          // Keep original date
        };
      }
      editingWordId = null; // reset after update
    } else {
      // ➕ Add new word
      const word = {
        id: Date.now(),
        text: wordInput.value,
        definition: defInput.value,
        example: exampleInput.value,
        type: typeSelect.value,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      words.push(word);
    }

    // saveWord(word);
    localStorage.setItem("vocabWords", JSON.stringify(words));
    renderWords(words);
    closeModal();
    form.reset();

    document.getElementById("modalTitle").textContent = "Add New Word";
    document.getElementById("submitBtn").textContent = "Add Word";
  });
}

// Save to localStorage
function saveWord(word) {
  const words = JSON.parse(localStorage.getItem("vocabWords") || "[]");
  words.push(word);
  localStorage.setItem("vocabWords", JSON.stringify(words));
  renderWords(words);
}

// Load and render from localStorage
function loadWords() {
  const words = JSON.parse(localStorage.getItem("vocabWords") || "[]");
  renderWords(words);
}

// Load card template once
fetch("components/word-card.html")
  .then((res) => res.text())
  .then((html) => {
    wordCardTemplate = html;
    loadWords(); // Load words after template is ready
  });

function renderWords(words) {
  const list = document.getElementById("word-list");
  list.innerHTML = "";
  const bgColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-orange-100",
  ];

  words.forEach((word) => {
    const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    // Replace placeholders with actual values
    const cardHTML = wordCardTemplate
      .replace("{{word}}", word.text)
      .replace("{{type}}", word.type)
      .replace("{{definition}}", word.definition)
      .replace("{{example}}", word.example)
      .replace("{{date}}", word.date)
      // .replace("{{id}}", word.id)
      .replace(/{{id}}/g, word.id)
      .replace("{{bgColor}}", randomColor);

    const card = document.createElement("div");
    card.innerHTML = cardHTML;
    list.appendChild(card.firstElementChild); // only append the actual .word-card div
  });

  lucide.createIcons(); // Call after rendering cards
}

function editWord(id) {
  const words = JSON.parse(localStorage.getItem("vocabWords") || "[]");
  const word = words.find((w) => w.id == id);
  if (!word) return;

  editingWordId = id;
  openModal();

  // Change modal title & button
  document.getElementById("modalTitle").textContent = "Edit Word";
  document.getElementById("submitBtn").textContent = "Update Word";

  // Fill form
  const form = document.getElementById("add-word-form");
  if (!form) return;

  const [wordInput, defInput, exampleInput, typeSelect] =
    form.querySelectorAll("input, select");
  wordInput.value = word.text;
  defInput.value = word.definition;
  exampleInput.value = word.example;
  typeSelect.value = word.type;
}
 
function deleteWord(id) {
  if (!confirm("Delete this word?")) return;

  const words = JSON.parse(localStorage.getItem("vocabWords") || "[]");
  // const updated = words.filter(w => w.id != id);
  const updated = words.filter((w) => w.id !== Number(id));
  console.log("Deleting ID:", id, "Type:", typeof id);
  localStorage.setItem("vocabWords", JSON.stringify(updated));
  renderWords(updated);
}
