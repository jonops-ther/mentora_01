// assets/js/create_activity.js

document.addEventListener('DOMContentLoaded', () => {
    // Re-initialize icons since this is a new page and we might dynamically add more
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const form = document.getElementById('activity-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const submitBtn = document.getElementById('submit-activity-btn');
    const badgeSelect = document.getElementById('act-badge-select');
    const newBadgeForm = document.getElementById('new-badge-form');

    const actPointsInput = document.getElementById('act-points');
    const pointsInfoBox = document.getElementById('points-per-q-info');
    const ppqVal = document.getElementById('ppq-val');
    const questionError = document.getElementById('question-error');

    // Context from URL
    const urlParams = new URLSearchParams(window.location.search);
    const contextFicha = urlParams.get('ficha');
    const materiaSelect = document.getElementById('act-materia');

    if (contextFicha && materiaSelect) {
        if (materiaSelect.querySelector(`option[value="${contextFicha}"]`)) {
            materiaSelect.value = contextFicha;
            // Optionally disable or make visually read-only
            materiaSelect.style.pointerEvents = 'none';
            materiaSelect.style.backgroundColor = '#f3f4f6';
        }
    }

    let questionCount = 0;

    // Toggle new badge fields
    badgeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'new') {
            newBadgeForm.classList.remove('hidden');
        } else {
            newBadgeForm.classList.add('hidden');
        }
    });

    const badgeTypeSelect = document.getElementById('badge-type-select');
    const badgeIconContainer = document.getElementById('badge-icon-select-container');
    const badgeImageInput = document.getElementById('new-badge-image');

    if (badgeTypeSelect) {
        badgeTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'icon') {
                badgeIconContainer.classList.remove('hidden');
                badgeImageInput.classList.add('hidden');
            } else {
                badgeIconContainer.classList.add('hidden');
                badgeImageInput.classList.remove('hidden');
            }
        });
    }

    // Create a new question block
    const createQuestionHTML = (index) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 border border-gray-200 rounded-xl p-4 relative question-block';
        div.setAttribute('data-index', index);

        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-gray-700 text-sm">Pregunta ${index}</h4>
                <button type="button" class="text-red-400 hover:text-red-600 remove-q-btn">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
            
            <input type="text" placeholder="Escribe la pregunta..." required
                class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 mb-3 outline-none focus:border-mentora-blue-light transition-all text-sm q-text">
            
            <div class="flex items-center gap-2 mb-4">
                <i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>
                <input type="number" min="1" placeholder="Min" required
                    class="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-sm focus:border-mentora-blue-light q-time">
                <span class="text-xs text-gray-500 font-medium">Minuto(s) p/pregunta</span>
            </div>

            <div class="space-y-2">
                <p class="text-xs font-bold text-gray-700 mb-1">Opciones de Respuesta (Marca la correcta)</p>
                
                <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 focus-within:border-mentora-blue-light">
                    <input type="radio" name="correct_${index}" required class="w-4 h-4 text-mentora-green focus:ring-mentora-green">
                    <input type="text" placeholder="Opción A" required class="flex-1 outline-none text-sm bg-transparent q-opt">
                </div>
                
                <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 focus-within:border-mentora-blue-light">
                    <input type="radio" name="correct_${index}" required class="w-4 h-4 text-mentora-green focus:ring-mentora-green">
                    <input type="text" placeholder="Opción B" required class="flex-1 outline-none text-sm bg-transparent q-opt">
                </div>

                <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 focus-within:border-mentora-blue-light">
                    <input type="radio" name="correct_${index}" required class="w-4 h-4 text-mentora-green focus:ring-mentora-green">
                    <input type="text" placeholder="Opción C" required class="flex-1 outline-none text-sm bg-transparent q-opt">
                </div>

                <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 focus-within:border-mentora-blue-light">
                    <input type="radio" name="correct_${index}" required class="w-4 h-4 text-mentora-green focus:ring-mentora-green">
                    <input type="text" placeholder="Opción D" required class="flex-1 outline-none text-sm bg-transparent q-opt">
                </div>
            </div>
        `;

        // Handle delete
        const removeBtn = div.querySelector('.remove-q-btn');
        removeBtn.addEventListener('click', () => {
            div.remove();
            reindexQuestions();
            validateForm();
        });

        return div;
    };

    const reindexQuestions = () => {
        const blocks = questionsContainer.querySelectorAll('.question-block');
        questionCount = blocks.length;
        blocks.forEach((block, idx) => {
            const newIndex = idx + 1;
            block.setAttribute('data-index', newIndex);
            block.querySelector('h4').textContent = `Pregunta ${newIndex}`;

            // Fix radio button grouping
            const radios = block.querySelectorAll('input[type="radio"]');
            radios.forEach(r => r.setAttribute('name', `correct_${newIndex}`));
        });

        updatePointsDistribution();
    };

    addQuestionBtn.addEventListener('click', () => {
        questionCount++;
        const newQ = createQuestionHTML(questionCount);
        questionsContainer.appendChild(newQ);
        if (window.lucide) window.lucide.createIcons();
        validateForm();
        updatePointsDistribution();
    });

    const updatePointsDistribution = () => {
        const points = parseInt(actPointsInput.value) || 0;
        const validQuestions = questionsContainer.querySelectorAll('.question-block').length;

        if (points > 0 && validQuestions > 0) {
            pointsInfoBox.classList.remove('hidden');
            const divided = Math.floor(points / validQuestions);
            ppqVal.textContent = divided;
        } else {
            pointsInfoBox.classList.add('hidden');
        }
    };

    actPointsInput.addEventListener('input', () => {
        updatePointsDistribution();
        validateForm();
    });

    // Initial setup: create 5 empty questions to encourage the user
    for (let i = 0; i < 5; i++) {
        addQuestionBtn.click();
    }

    const validateForm = () => {
        let isValid = true;

        // Check Native Form Validity
        if (!form.checkValidity()) {
            isValid = false;
        }

        // Must have at least 5 questions
        const blocks = questionsContainer.querySelectorAll('.question-block');
        if (blocks.length < 5) {
            isValid = false;
            questionError.classList.remove('hidden');
        } else {
            questionError.classList.add('hidden');
        }

        if (isValid) {
            submitBtn.removeAttribute('disabled');
            submitBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            submitBtn.classList.add('bg-mentora-green', 'text-mentora-blue-dark', 'hover:bg-green-400');
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            submitBtn.classList.remove('bg-mentora-green', 'text-mentora-blue-dark', 'hover:bg-green-400');
        }
    };

    // Attach native validation listeners to inputs inside the form to re-trigger validation on change
    form.addEventListener('input', validateForm);
    form.addEventListener('change', validateForm);

    // Form Submit => Show Modal
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        document.getElementById('success-modal').classList.remove('hidden');
    });

});
