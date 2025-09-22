// js/app.js
// Dynamic API URL - works for both localhost and deployment
const API_URL = window.location.hostname === 'localhost' ? 
    "http://localhost:3000/api/words" : 
    "/api/words";
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
    // Use multiple approaches to ensure form binding works
    const bindForm = () => {
        const form = document.getElementById("add-word-form");
        if (!form) {
            console.log('Form not found, retrying in 500ms...');
            setTimeout(bindForm, 500);
            return;
        }
        
        console.log('Form found, binding events...');
        
        // Remove any existing event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener("submit", handleFormSubmit);
        console.log('Form events bound successfully');
    };
    
    bindForm();
}

// Separate form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    // Get form inputs by ID for reliability
    const wordInput = document.getElementById('word-input');
    const defInput = document.getElementById('definition-input');
    const exampleInput = document.getElementById('example-input');
    const typeSelect = document.getElementById('type-select');
    
    console.log('Form inputs found:', {
        word: !!wordInput,
        def: !!defInput, 
        example: !!exampleInput,
        type: !!typeSelect
    });
    
    if (!wordInput || !defInput || !exampleInput || !typeSelect) {
        console.error('Form inputs not found');
        alert('Form inputs not found. Please try again.');
        return;
    }
    
    const wordData = {
        text: wordInput.value.trim(),
        definition: defInput.value.trim(),
        example: exampleInput.value.trim(),
        type: typeSelect.value,
    };
    
    console.log('Submitting word data:', wordData);
    
    // Validation
    if (!wordData.text || !wordData.definition || !wordData.example || !wordData.type) {
        alert('Please fill in all fields');
        return;
    }

    const url = editingWordId ? `${API_URL}/${editingWordId}` : API_URL;
    const method = editingWordId ? "PUT" : "POST";
    
    console.log(`Making ${method} request to:`, url);

    try {
        const result = await fetchAPI(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wordData),
        });
        
        console.log('API response:', result);
        await loadWords();
        closeModal();
        alert(`Word ${editingWordId ? 'updated' : 'added'} successfully!`);
    } catch (error) {
        console.error('Error submitting form:', error);
        alert(`Failed to ${editingWordId ? 'update' : 'save'} word: ${error.message}`);
    }
}

async function loadWords() {
    console.log('Loading words from:', API_URL);
    try {
        allWords = await fetchAPI(API_URL);
        console.log('Loaded words:', allWords);
        if (!allWords || !Array.isArray(allWords)) {
            console.error('Invalid words data returned from API');
            // Try to load from local storage as fallback
            const localWords = localStorage.getItem('vocab-words');
            if (localWords) {
                allWords = JSON.parse(localWords);
                console.log('Loaded words from localStorage:', allWords);
            } else {
                // If no API and no local storage, use sample data
                allWords = [
                    {
                        id: 1,
                        text: "Ephemeral",
                        definition: "Lasting for a very short time.",
                        example: "The beauty of the cherry blossoms is ephemeral.",
                        type: "adjective",
                        date: "15 Jul 2023"
                    },
                    {
                        id: 2,
                        text: "Ubiquitous",
                        definition: "Present, appearing, or found everywhere.",
                        example: "Mobile phones are now ubiquitous.",
                        type: "adjective",
                        date: "16 Jul 2023"
                    }
                ];
                console.log('Using sample data');
            }
        }
        renderWords(allWords);
    } catch (error) {
        console.error('Failed to load words:', error);
        // Fallback to sample data
        allWords = [
            {
                id: 1,
                text: "Ephemeral",
                definition: "Lasting for a very short time.",
                example: "The beauty of the cherry blossoms is ephemeral.",
                type: "adjective",
                date: "15 Jul 2023"
            },
            {
                id: 2,
                text: "Ubiquitous",
                definition: "Present, appearing, or found everywhere.",
                example: "Mobile phones are now ubiquitous.",
                type: "adjective",
                date: "16 Jul 2023"
            }
        ];
        renderWords(allWords);
    }
}

function renderWords(words) {
    console.log('Rendering words:', words);
    const list = document.getElementById("word-list");
    if (!list) {
        console.error('Word list container not found');
        return;
    }
    
    list.innerHTML = "";
    
    if (!words || words.length === 0) {
        list.innerHTML = '<div class="theme-card p-6 col-span-full text-center"><p class="theme-text">No words found. Add some vocabulary!</p></div>';
        return;
    }
    
    const paginatedWords = words.slice((currentPage - 1) * wordsPerPage, currentPage * wordsPerPage);
    console.log('Paginated words for rendering:', paginatedWords);
    
    paginatedWords.forEach((word, index) => {
        const card = createWordCard(word, index);
        if (card) {
            list.appendChild(card);
        } else {
            console.error('Failed to create card for word:', word);
        }
    });
    renderPagination(words.length);
    
    // Ensure icons are rendered
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createWordCard(word, index) {
    // Debug logging to check word data
    console.log('Creating card for word:', word);
    
    // Ensure all fields exist with fallbacks
    const wordData = {
        id: word.id || Date.now(),
        text: word.text || 'No word',
        type: word.type || 'unknown',
        definition: word.definition || 'No definition available',
        example: word.example || 'No example available',
        date: word.date || 'Unknown date'
    };
    
    let cardHTML;
    
    // Use template if available, otherwise use fallback
    if (wordCardTemplate && wordCardTemplate.includes('{{word}}')) {
        cardHTML = wordCardTemplate
            .replace(/{{id}}/g, wordData.id)
            .replace(/{{word}}/g, wordData.text)
            .replace(/{{type}}/g, wordData.type)
            .replace(/{{definition}}/g, wordData.definition)
            .replace(/{{example}}/g, wordData.example)
            .replace(/{{date}}/g, wordData.date)
            .replace(/{{bgColor}}/g, "");
    } else {
        // Fallback template if main template fails
        console.warn('Using fallback card template');
        cardHTML = `
            <div class="word-card relative theme-card p-4 soft-fade-in cursor-pointer group">
                <button onclick="editWord('${wordData.id}')" class="absolute top-3 right-12 p-2 theme-secondary-bg rounded-full shadow-sm hidden group-hover:block md:group-hover:block sm:block theme-transition hover:theme-accent-bg" title="Edit word">
                    <i data-lucide="pencil" class="w-4 h-4 theme-text"></i>
                </button>
                <button onclick="deleteWord('${wordData.id}')" class="absolute top-3 right-2 p-2 theme-secondary-bg rounded-full shadow-sm hidden group-hover:block md:group-hover:block sm:block theme-transition hover:bg-red-500" title="Delete word">
                    <i data-lucide="trash-2" class="w-4 h-4 text-red-400 hover:text-white"></i>
                </button>
                <h2 class="text-xl md:text-2xl font-bold theme-text mb-2">${wordData.text}</h2>
                <span class="inline-block text-sm theme-accent-bg px-3 py-1 rounded-full font-semibold" style="color: var(--theme-background);">${wordData.type}</span>
                <div class="mt-4 space-y-3">
                    <p class="text-base md:text-sm theme-text leading-relaxed">${wordData.definition}</p>
                    <div class="bg-gradient-to-r from-transparent via-current to-transparent opacity-20 h-px"></div>
                    <p class="text-base md:text-sm theme-text font-medium leading-relaxed">
                        <span class="theme-accent-text opacity-75 text-sm">Example:</span><br>
                        <span class="italic">"${wordData.example}"</span>
                    </p>
                </div>
                <p class="text-right text-sm theme-text opacity-75 mt-4 font-medium">${wordData.date}</p>
            </div>
        `;
    }
    
    const card = document.createElement("div");
    card.innerHTML = cardHTML;
    
    // Add staggered animation delay for smooth appearance
    const cardElement = card.firstElementChild;
    if (cardElement) {
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        // Debug: Check if example is present in the rendered HTML
        const exampleSpan = cardElement.querySelector('.italic');
        console.log('Example element found:', !!exampleSpan, exampleSpan?.textContent);
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
