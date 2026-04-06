// Pobieranie elementów DOM
const taskInput = document.getElementById('taskInput');
const listSelector = document.getElementById('listSelector');
const addTaskBtn = document.getElementById('addTaskBtn');
const undoBtn = document.getElementById('undoBtn');
const searchInput = document.getElementById('searchInput');
const caseSensitiveCheck = document.getElementById('caseSensitiveCheck');

// Elementy Modala
const modal = document.getElementById('deleteModal');
const modalText = document.getElementById('modalText');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Stan aplikacji (do cofania usunięcia)
let deletedTaskInfo = null;
let taskPendingDeletion = null;

// Obsługa zwijania/rozwijania list
const listHeaders = document.querySelectorAll('.list-header');
listHeaders.forEach((header) => {
    header.addEventListener('click', () => {
        // Znajduje listę <ul> będącą rodzeństwem nagłówka <h3>
        const ul = header.nextElementSibling;
        if (ul.style.display === 'none') {
            ul.style.display = 'block';
        } else {
            ul.style.display = 'none';
        }
    });
});

// Funkcja dodawania zadania
const addTask = () => {
    const text = taskInput.value.trim();
    
    // Walidacja niepustego pola
    if (text === '') {
        alert('Pozycja nie może być pusta!');
        return;
    }

    const targetListId = listSelector.value;
    const targetList = document.getElementById(targetListId);

    // Tworzenie elementów HTML
    const li = document.createElement('li');
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.className = 'task-text';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';

    // Składanie w całość
    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteBtn);

    // Obsługa kliknięcia w zadanie (oznacz jako zrobione)
    li.addEventListener('click', (event) => {
        // Ignorujemy kliknięcie, jeśli kliknięto przycisk usuwania
        if (event.target === deleteBtn) {
            return;
        }

        li.classList.toggle('done');
        
        if (li.classList.contains('done')) {
            const now = new Date();
            // Formatowanie daty i czasu
            dateSpan.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        } else {
            dateSpan.textContent = '';
        }
    });

    // Obsługa usunięcia (otwarcie modala)
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        taskPendingDeletion = {
            element: li,
            parentList: targetList
        };
        modalText.textContent = `Czy na pewno chcesz usunąć zadanie o treści: "${text}"?`;
        modal.classList.remove('hidden');
    });

    // Dodanie do wybranej listy i czyszczenie inputa
    targetList.appendChild(li);
    taskInput.value = '';
    
    // Odświeżenie wyszukiwania
    filterTasks();
};

// Nasłuchiwanie na przycisk dodawania
addTaskBtn.addEventListener('click', addTask);

// Obsługa modala (Usuń)
confirmBtn.addEventListener('click', () => {
    if (taskPendingDeletion !== null) {
        // Zapisz do kosza (tylko 1 wstecz)
        deletedTaskInfo = taskPendingDeletion;
        
        // Usuń z DOM
        deletedTaskInfo.parentList.removeChild(deletedTaskInfo.element);
        
        // Pokaż przycisk cofania
        undoBtn.classList.remove('hidden');
        
        taskPendingDeletion = null;
    }
    modal.classList.add('hidden');
});

// Obsługa modala (Anuluj)
cancelBtn.addEventListener('click', () => {
    taskPendingDeletion = null;
    modal.classList.add('hidden');
});

// Funkcja cofania (Ctrl+Z)
const undoDeletion = () => {
    if (deletedTaskInfo !== null) {
        deletedTaskInfo.parentList.appendChild(deletedTaskInfo.element);
        deletedTaskInfo = null;
        undoBtn.classList.add('hidden');
    }
};

undoBtn.addEventListener('click', undoDeletion);

// Obsługa Ctrl+Z
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        undoDeletion();
    }
});

// Dynamiczne wyszukiwanie
const filterTasks = () => {
    const query = searchInput.value;
    const isCaseInsensitive = caseSensitiveCheck.checked;
    
    // Szukamy po stringu w zależności od checkboxa
    const finalQuery = isCaseInsensitive ? query.toLowerCase() : query;
    
    const allTasks = document.querySelectorAll('li');
    
    allTasks.forEach((task) => {
        const textElement = task.querySelector('.task-text');
        if (textElement !== null) {
            const taskText = textElement.textContent;
            const finalText = isCaseInsensitive ? taskText.toLowerCase() : taskText;
            
            if (finalText.includes(finalQuery)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        }
    });
};

// Nasłuchiwanie na wpisywanie w wyszukiwarkę oraz zmianę checkboxa
searchInput.addEventListener('input', filterTasks);
caseSensitiveCheck.addEventListener('change', filterTasks);