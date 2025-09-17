const quizData = [
  { q: "What is considered a healthy billable utilization percentage for our team?", type: "single", options: ["60–70%","75–85%","85–95%","95% and above"], answer: 1 },
  { q: "Which of the following contributes to billable utilization?", type: "multi", options: ["Internal meetings","Client project work","Training sessions","Team outings"], answer: [1,2] },
  { q: "Time spent on documentation for a client project is considered billable.", type: "boolean", options: ["True","False"], answer: 0 },
  { q: "Which of these is a productive way to use non-billable hours?", type: "multi", options: ["Browsing social media","Attending enablement sessions","Taking extended breaks","Ignoring calendar invites"], answer: [1] },
  { q: "What is the best way to plan non-billable time during a low-utilization period?", type: "multi", options: ["Wait for work to come","Proactively seek shadowing opportunities / ask for activity","Take unplanned leave","Avoid communication"], answer: [1] },
  { q: "What is the primary benefit of planning enablement activities during non-billable time?", type: "single", options: ["It fills time","It helps improve future billability","It reduces workload","It avoids meetings"], answer: 1 },
  { q: "Which of the following is a good example of enablement?", type: "single", options: ["Learning a new tool or platform","Watching random YouTube videos","Taking a long lunch","Ignoring skill gaps"], answer: 0 },
  { q: "You have 10 hours of non-billable time this week. What’s the best way to use it?", type: "single", options: ["Schedule learning sessions","Do nothing","Take leave","Delay timesheet entry"], answer: 0 },
  { q: "Your utilization is low this month. What should you do?", type: "single", options: ["Escalate to your manager","Wait for allocation","Volunteer for internal initiatives","Both a and c"], answer: 3 },
  { q: "In your opinion, what’s one thing we can do better as a team to improve utilization?", type: "text", answer: null }
];

let current = 0, score = 0, awaitingFeedback = false;
const questionArea = document.getElementById('question-area');
const nextBtn = document.getElementById('next-btn');
const resultArea = document.getElementById('result-area');

function updateScoreboard() {
  document.getElementById('q-num').textContent = `Q${Math.min(current+1,10)}/10`;
  document.getElementById('score').textContent = `${score} pts`;
}

function updateProgress() {
  const pct = (current / quizData.length) * 100;
  document.getElementById('progress-fill').style.width = `${pct}%`;
}

function loadQuestion() {
  awaitingFeedback = false;
  nextBtn.textContent = 'Submit';
  questionArea.innerHTML = '';
  resultArea.classList.add('hidden');
  
  updateScoreboard();
  updateProgress();

  if (current >= quizData.length) {
    showResult();
    return;
  }

  const data = quizData[current];
  const card = document.createElement('div');
  card.className = 'question-card';
  setTimeout(() => card.classList.add('visible'), 50);

  const title = document.createElement('h2');
  title.textContent = `Q${current+1}. ${data.q}`;
  card.appendChild(title);

  if (data.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'text-answer';
    input.className = 'option';
    input.placeholder = 'Type your answer here...';
    card.appendChild(input);
  } else {
    data.options.forEach((opt, i) => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.name = 'answer';
      input.type = data.type === 'multi' ? 'checkbox' : 'radio';
      input.value = i;
      label.appendChild(input);
      label.append(' ' + opt);
      card.appendChild(label);
    });
  }

  const feedback = document.createElement('div');
  feedback.id = 'feedback';
  feedback.className = 'feedback';
  card.appendChild(feedback);

  questionArea.appendChild(card);
}

function showResult() {
  questionArea.classList.add('hidden');
  nextBtn.classList.add('hidden');
  resultArea.classList.remove('hidden');
  resultArea.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>You scored <strong>${score} out of 10</strong></p>
    <p>That's ${Math.round((score/10)*100)}% correct!</p>
  `;
  confetti({
    particleCount: 200,
    spread: 100,
    colors: ['#FF0000','#0066CC','#00FFFF','#8B00FF','#FF00FF','#00FF00'],
    origin: { y: 0.6 }
  });
}

nextBtn.addEventListener('click', () => {
  const data = quizData[current];
  const feedbackEl = document.getElementById('feedback');

  if (awaitingFeedback) {
    current++;
    loadQuestion();
    return;
  }

  let correct = false;
  if (data.type === 'text') {
    correct = document.getElementById('text-answer').value.trim() !== '';
  } else {
    const inputs = Array.from(document.querySelectorAll('input[name="answer"]'));
    if (data.type === 'multi') {
      const chosen = inputs.filter(i => i.checked).map(i => +i.value).sort();
      correct = JSON.stringify(chosen) === JSON.stringify(data.answer.sort());
    } else {
      const choice = inputs.find(i => i.checked);
      correct = choice && +choice.value === data.answer;
    }
  }

  if (correct) {
    score++;
    document.getElementById('sound-correct').play().catch(() => {});
  } else {
    document.getElementById('sound-wrong').play().catch(() => {});
  }

  updateScoreboard();

  feedbackEl.textContent = correct ? '✅ Correct!' : '❌ Incorrect.';
  setTimeout(() => feedbackEl.classList.add('visible'), 50);

  awaitingFeedback = true;
  nextBtn.textContent = 'Next';
});

// Initialize
loadQuestion();
