// assets/js/quiz.js

document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the quiz page
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    // Elements
    const introScreen = document.getElementById('quiz-intro');
    const questionScreen = document.getElementById('quiz-question');
    const resultsScreen = document.getElementById('quiz-results');

    const startBtn = document.getElementById('start-quiz-btn');
    const alreadyPlayedMsg = document.getElementById('already-played-msg');
    const optionsContainer = document.getElementById('options-container');
    const questionText = document.getElementById('question-text');
    const questionCounter = document.getElementById('question-counter');
    const currentScoreDisplay = document.getElementById('current-score-display');
    const progressBar = document.getElementById('progress-bar');

    const multiplierDisplays = document.querySelectorAll('#multiplier-display, #final-multiplier-display');
    const streakDisplay = document.getElementById('streak-display');

    const correctAnswersDisplay = document.getElementById('correct-answers-display');
    const totalPointsDisplay = document.getElementById('total-points-display');

    // Quiz State
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let totalPoints = 0;

    // Base Settings
    const POINTS_PER_QUESTION = 10;

    // Streak Logic
    let streak = parseInt(localStorage.getItem('mentora_quiz_streak')) || 0;
    let lastPlayed = localStorage.getItem('mentora_quiz_last_played');
    const today = new Date().toISOString().split('T')[0];

    // Check Date
    let hasPlayedToday = lastPlayed === today;

    if (hasPlayedToday) {
        startBtn.classList.add('hidden');
        alreadyPlayedMsg.classList.remove('hidden');
    } else {
        // Calculate Streak before starting (just for display)
        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Next consecutive day
                streak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                streak = 1;
            }
        } else {
            streak = 1;
        }
    }

    // Limit Streak
    streak = Math.min(streak, 11); // Max 11 for max multiplier of x2.0
    if (streak === 0) streak = 1; // Default state

    // Calculate Multiplier
    const multiplier = Math.min(1.0 + ((streak - 1) * 0.1), 2.0).toFixed(1);

    // Update Intro Display
    streakDisplay.textContent = streak;
    multiplierDisplays.forEach(el => el.textContent = 'x' + multiplier);

    // Questions Database
    const questions = [
        {
            subject: 'Comunicación',
            text: '¿Cuál de estos es un conector de adversidad?',
            options: ['Sin embargo', 'Por lo tanto', 'Además', 'En consecuencia'],
            correct: 0
        },
        {
            subject: 'Ética y Valores',
            text: 'La capacidad de ponerse en el lugar del otro se llama:',
            options: ['Simpatía', 'Apatía', 'Empatía', 'Resiliencia'],
            correct: 2
        },
        {
            subject: 'Bilingüismo',
            text: '¿Qué significa la palabra "Deployment" en desarrollo de software?',
            options: ['Desarrollo', 'Despliegue', 'Borrado', 'Prueba'],
            correct: 1
        },
        {
            subject: 'SST',
            text: '¿Qué significan las siglas EPP?',
            options: ['Empresas Para Público', 'Equipos Preventivos Privados', 'Equipos de Protección Personal', 'Evaluación de Primeros Pasos'],
            correct: 2
        },
        {
            subject: 'Ambiental',
            text: '¿Cuál es el principal gas responsable del efecto invernadero en la Tierra?',
            options: ['Oxígeno', 'Dióxido de Carbono (CO2)', 'Argón', 'Helio'],
            correct: 1
        }
    ];

    // Functions
    const loadQuestion = () => {
        const q = questions[currentQuestionIndex];
        questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
        questionText.textContent = q.text;

        // Progress
        progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

        optionsContainer.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-mentora-blue-light hover:bg-blue-50 transition-all font-medium text-gray-700';
            btn.textContent = option;
            btn.onclick = () => handleAnswer(index, btn);
            optionsContainer.appendChild(btn);
        });
    };

    const handleAnswer = (selectedIndex, buttonDiv) => {
        // Disable all buttons
        const allButtons = optionsContainer.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        const q = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) {
            buttonDiv.classList.add('bg-mentora-green', 'text-white', 'border-mentora-green');
            buttonDiv.classList.remove('text-gray-700', 'bg-white', 'hover:bg-blue-50');
            correctAnswersCount++;

            // Add points based on multiplier
            const pointsWon = Math.floor(POINTS_PER_QUESTION * parseFloat(multiplier));
            totalPoints += pointsWon;
            currentScoreDisplay.textContent = `${totalPoints} pts`;

            // Success animation
            if (window.confetti) {
                confetti({
                    particleCount: 30,
                    spread: 40,
                    origin: { y: 0.8 },
                    colors: ['#AADD37', '#1F6DA9']
                });
            }
        } else {
            buttonDiv.classList.add('bg-red-500', 'text-white', 'border-red-500');
            buttonDiv.classList.remove('text-gray-700', 'bg-white', 'hover:bg-blue-50');

            // Highlight correct one
            allButtons[q.correct].classList.add('border-mentora-green', 'text-mentora-green');
            allButtons[q.correct].classList.remove('text-gray-700', 'bg-white', 'border-gray-100');
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 1200);
    };

    const showResults = () => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            questionScreen.classList.add('hidden');
            questionScreen.classList.remove('flex');
            resultsScreen.classList.remove('hidden');
            resultsScreen.classList.add('flex');

            correctAnswersDisplay.textContent = `${correctAnswersCount}/${questions.length}`;
            totalPointsDisplay.textContent = `+${totalPoints}`;

            // Save state
            localStorage.setItem('mentora_quiz_last_played', today);
            localStorage.setItem('mentora_quiz_streak', streak.toString());

            // Add to global points
            let globalPoints = parseInt(localStorage.getItem('mentora_global_points')) || 1250;
            globalPoints += totalPoints;
            localStorage.setItem('mentora_global_points', globalPoints.toString());

            // Big Confetti
            if (window.confetti) {
                const duration = 3000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                const interval = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }
                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
            }
        }, 500);
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    // Listeners
    startBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        questionScreen.classList.add('flex');
        loadQuestion();
    });
});
