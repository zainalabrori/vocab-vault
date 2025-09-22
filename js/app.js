// js/app.js
const API_URL = "http://localhost:3000/api/words";
let wordCardTemplate = "";
let editingWordId = null;
let allWords = [];
let currentPage = 1;
const wordsPerPage = 6;

// Function to handle API requests with error handling
async function fetchAPI(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        // You can add user-facing error messages here
    }
}

async function loadComponent(id, path) {
    try {
        const res = await fetch(path);
        if (!res.ok) {
            throw new Error(`Failed to load ${path}: ${res.status}`);
        }
        const html = await res.text();
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
            if (id === "modal") {
                bindFormEvents();
            }
        }
    } catch (error) {
        console.error(`Error loading component ${id} from ${path}:`, error);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Load components first
        await loadComponent("navbar", "components/navbar.html");
        await loadComponent("modal", "components/add-word-form.html");
        
        // Notify that components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
        
        // Load word card template
        wordCardTemplate = await fetch("components/word-card.html").then(res => res.text());
        
        // Load data
        await loadWords();
        
        // Bind events with error handling
        const searchInput = document.getElementById("search-input");
        const sortSelect = document.getElementById("sort-select");
        
        if (searchInput) {
            searchInput.addEventListener("input", handleSearch);
        }
        if (sortSelect) {
            sortSelect.addEventListener("change", handleSort);
        }
        
        // Ensure Lucide icons are rendered
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

function openModal() {
    document.getElementById("addModal")?.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("addModal");
    if (modal) {
        modal.classList.add("hidden");
    }
    
    editingWordId = null;
    
    // Reset modal content
    const modalTitle = document.getElementById("modalTitle");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("add-word-form");
    
    if (modalTitle) modalTitle.textContent = "Add New Word";
    if (submitBtn) submitBtn.textContent = "Add Word";
    if (form) form.reset();
}

function bindFormEvents() {
    const form = document.getElementById("add-word-form");
    if (!form) {
        console.log('Form not found, retrying...');
        setTimeout(bindFormEvents, 100);
        return;
    }
    
    console.log('Binding form events...');
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get form inputs by ID for reliability
        const wordInput = document.getElementById('word-input');
        const defInput = document.getElementById('definition-input');
        const exampleInput = document.getElementById('example-input');
        const typeSelect = document.getElementById('type-select');
        
        if (!wordInput || !defInput || !exampleInput || !typeSelect) {
            console.error('Form inputs not found');
            return;
        }
        
        const wordData = {
            text: wordInput.value.trim(),
            definition: defInput.value.trim(),
            example: exampleInput.value.trim(),
            type: typeSelect.value,
        };
        
        console.log('Submitting word data:', wordData);

        const url = editingWordId ? `${API_URL}/${editingWordId}` : API_URL;
        const method = editingWordId ? "PUT" : "POST";

        try {
            await fetchAPI(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(wordData),
            });

            await loadWords();
            closeModal();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save word. Please try again.');
        }
    });
}

async function loadWords() {
    allWords = await fetchAPI(API_URL);
    renderWords(allWords);
}

function renderWords(words) {
    const list = document.getElementById("word-list");
    list.innerHTML = "";
    const paginatedWords = words.slice((currentPage - 1) * wordsPerPage, currentPage * wordsPerPage);
    paginatedWords.forEach((word, index) => {
        const card = createWordCard(word, index);
        list.appendChild(card);
    });
    renderPagination(words.length);
    lucide.createIcons();
}

function createWordCard(word, index) {
    // Debug logging to check word data
    console.log('Creating card for word:', word);
    
    // Ensure all fields exist with fallbacks
    const wordData = {
        id: word.id || 'unknown',
        text: word.text || 'No word',
        type: word.type || 'unknown',
        definition: word.definition || 'No definition available',
        example: word.example || 'No example available',
        date: word.date || 'Unknown date'
    };
    
    const cardHTML = wordCardTemplate
        .replace(/{{id}}/g, wordData.id)
        .replace(/{{word}}/g, wordData.text)
        .replace(/{{type}}/g, wordData.type)
        .replace(/{{definition}}/g, wordData.definition)
        .replace(/{{example}}/g, wordData.example)
        .replace(/{{date}}/g, wordData.date)
        .replace(/{{bgColor}}/g, ""); // Remove bgColor placeholder
    
    const card = document.createElement("div");
    card.innerHTML = cardHTML;
    
    // Add staggered animation delay for smooth appearance
    const cardElement = card.firstElementChild;
    if (cardElement) {
        cardElement.style.animationDelay = `${index * 0.1}s`;
    }
    
    return cardElement;
}

async function editWord(id) {
    const word = await fetchAPI(`${API_URL}/${id}`);
    if (!word) return;
    
    editingWordId = id;
    openModal();
    
    // Wait a bit for modal to open
    setTimeout(() => {
        document.getElementById("modalTitle").textContent = "Edit Word";
        document.getElementById("submitBtn").textContent = "Update Word";
        
        // Get form inputs by ID
        const wordInput = document.getElementById('word-input');
        const defInput = document.getElementById('definition-input');
        const exampleInput = document.getElementById('example-input');
        const typeSelect = document.getElementById('type-select');
        
        if (wordInput && defInput && exampleInput && typeSelect) {
            wordInput.value = word.text;
            defInput.value = word.definition;
            exampleInput.value = word.example;
            typeSelect.value = word.type;
        }
    }, 100);
}

async function deleteWord(id) {
    if (!confirm("Delete this word?")) return;
    await fetchAPI(`${API_URL}/${id}`, { method: "DELETE" });
    await loadWords();
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredWords = allWords.filter(word =>
        word.text.toLowerCase().includes(searchTerm) ||
        word.definition.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reset to first page when searching
    renderWords(filteredWords);
}

function handleSort(event) {
    const sortBy = event.target.value;
    let sortedWords = [...allWords];
    if (sortBy === "alphabetical") {
        sortedWords.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === "date") {
        sortedWords.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    }
    renderWords(sortedWords);
}

function renderPagination(totalWords) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalWords / wordsPerPage);
    
    if (totalPages <= 1) return; // Don't show pagination if only one page
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = `px-3 py-1 rounded transition-all ${currentPage === i ? 'theme-pagination-active' : 'theme-pagination-inactive'}`;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            renderWords(allWords);
        });
        paginationContainer.appendChild(pageButton);
    }
}
