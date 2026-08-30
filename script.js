const scenarioContent = document.getElementById('scenarioContent');
const progressDots = [...document.querySelectorAll('.progress-dot')];

const notebookKey = 'leadershipLabNotebook';
let notes = JSON.parse(localStorage.getItem(notebookKey) || '[]');

function setProgress(step) {
  progressDots.forEach((dot, index) => dot.classList.toggle('active', index <= step));
}

function renderScenarioStart() {
  setProgress(0);
  scenarioContent.innerHTML = `
    <span class="scenario-label">A MOMENT</span>
    <h3>Jordan has been late three times this month.</h3>
    <p class="lead">You're their supervisor. Jordan is usually dependable. This morning, they arrive 18 minutes late and avoid eye contact as they walk past you.</p>
    <div class="reflection-box">
      <strong>Before you decide what to do:</strong>
      What story did your brain start writing?
    </div>
    <div class="choice-grid">
      <button class="choice-button" data-assumption="Jordan doesn't respect my time or the team.">They don't respect my time or the team.</button>
      <button class="choice-button" data-assumption="Something is probably going on outside of work.">Something must be going on outside work.</button>
      <button class="choice-button" data-assumption="Jordan is becoming unreliable.">They're becoming unreliable.</button>
      <button class="choice-button" data-assumption="I don't actually know yet.">I don't actually know yet.</button>
    </div>`;

  document.querySelectorAll('[data-assumption]').forEach(button => {
    button.addEventListener('click', () => renderScenarioReveal(button.dataset.assumption));
  });
}

function renderScenarioReveal(assumption) {
  setProgress(1);
  scenarioContent.innerHTML = `
    <span class="scenario-label">NOTICE THE STORY</span>
    <h3>Your brain offered: “${assumption}”</h3>
    <p class="lead">Maybe. Maybe not. A story can be compassionate or critical and still be a story.</p>
    <div class="reflection-box">
      <strong>What do you actually know?</strong>
      Jordan has been late three times. Today they were 18 minutes late. They avoided eye contact. That's the observable information you have.
    </div>
    <p class="lead">Then Jordan knocks on your door and says, “Can I talk to you? My mom's been having some health problems and mornings have been... a lot. I know I've been late.”</p>
    <button class="inline-action" id="continueScenario">Stay in the conversation →</button>
    <button class="inline-action secondary" id="saveStory">Save this reminder</button>`;

  document.getElementById('continueScenario').addEventListener('click', renderScenarioConversation);
  document.getElementById('saveStory').addEventListener('click', () => saveNote('STORY CHECK', 'What I observe is not the same as the story I attach to it. Get curious before getting certain.'));
}

function renderScenarioConversation() {
  setProgress(2);
  scenarioContent.innerHTML = `
    <span class="scenario-label">CONNECTION + ACCOUNTABILITY</span>
    <h3>Human connection doesn't require abandoning the hard part.</h3>
    <p class="lead">You can care about what Jordan is carrying and still talk clearly about what the team needs.</p>
    <div class="choice-grid">
      <button class="choice-button response-choice" data-response="Thanks for telling me. Let's talk about what mornings look like right now and what we need to put in place so you and the team both have what you need.">“Thanks for telling me. Let's talk about what mornings look like right now and what we need to put in place so you and the team both have what you need.”</button>
      <button class="choice-button response-choice" data-response="Don't worry about it. Family comes first.">“Don't worry about it. Family comes first.”</button>
      <button class="choice-button response-choice" data-response="I understand, but you still need to be here on time.">“I understand, but you still need to be here on time.”</button>
      <button class="choice-button response-choice" data-response="Why didn't you tell me sooner?">“Why didn't you tell me sooner?”</button>
    </div>`;

  document.querySelectorAll('.response-choice').forEach(button => button.addEventListener('click', () => renderScenarioReflection(button.dataset.response)));
}

function renderScenarioReflection(response) {
  scenarioContent.innerHTML = `
    <span class="scenario-label">REFLECT, DON'T SCORE</span>
    <h3>Notice what your response makes room for.</h3>
    <div class="reflection-box"><strong>You chose:</strong> “${response}”</div>
    <p class="lead">There isn't a magic sentence that guarantees connection. Ask instead: Did I make room for the human? Was I clear about the responsibility? Did curiosity stay present? What might I need to ask next?</p>
    <button class="inline-action" id="savePractice">Add the questions to my notebook</button>
    <button class="inline-action secondary" id="restartScenario">Try another path ↺</button>`;
  document.getElementById('savePractice').addEventListener('click', () => saveNote('HUMAN + ACCOUNTABILITY', 'Did I make room for the human? Was I clear about the responsibility? Did curiosity stay present? What might I need to ask next?'));
  document.getElementById('restartScenario').addEventListener('click', renderScenarioStart);
}

function saveNote(label, text) {
  if (!notes.some(note => note.text === text)) {
    notes.unshift({ label, text, saved: new Date().toLocaleDateString() });
    localStorage.setItem(notebookKey, JSON.stringify(notes));
  }
  renderNotebook();
  document.getElementById('openNotebook').classList.add('pulse');
  setTimeout(() => document.getElementById('openNotebook').classList.remove('pulse'), 400);
}

function renderNotebook() {
  const entries = document.getElementById('notebookEntries');
  document.getElementById('noteCount').textContent = notes.length;
  entries.innerHTML = notes.length ? notes.map(note => `
    <div class="note-entry">
      <small>${note.label}</small>
      <p>${note.text}</p>
    </div>`).join('') : '<p class="empty-note">Nothing saved yet. As you practice, you can keep reminders here. They stay only in this browser.</p>';
}

const drawer = document.getElementById('notebookDrawer');
const scrim = document.getElementById('drawerScrim');
function toggleDrawer(open) {
  drawer.classList.toggle('open', open);
  scrim.classList.toggle('show', open);
  drawer.setAttribute('aria-hidden', String(!open));
}
document.getElementById('openNotebook').addEventListener('click', () => toggleDrawer(true));
document.getElementById('closeNotebook').addEventListener('click', () => toggleDrawer(false));
scrim.addEventListener('click', () => toggleDrawer(false));
document.getElementById('clearNotebook').addEventListener('click', () => {
  notes = [];
  localStorage.removeItem(notebookKey);
  renderNotebook();
});

const roomPrompts = {
  mirror: {
    eyebrow: 'THE MIRROR',
    title: 'What are you bringing into the room?',
    text: 'Think about a leadership moment that is getting under your skin. Before focusing on the other person, turn the mirror toward yourself.',
    prompt: 'What am I feeling? What am I protecting? What outcome am I trying to control?',
    save: 'Before focusing on the other person: What am I feeling? What am I protecting? What outcome am I trying to control?'
  },
  pause: {
    eyebrow: 'THE PAUSE',
    title: 'You do not have to answer from your first reaction.',
    text: 'A pause is not avoidance. Sometimes it is the few seconds that let your values catch up with your nervous system.',
    prompt: 'What response would I be proud to own tomorrow?',
    save: 'Pause long enough to ask: What response would I be proud to own tomorrow?'
  },
  story: {
    eyebrow: 'THE STORIES WE TELL',
    title: 'What happened, and what did you add?',
    text: 'Our brains are meaning-making machines. Useful, fast, and occasionally wildly confident with incomplete information.',
    prompt: 'Write the observable facts first. Then name the story you attached to them.',
    save: 'Separate observable facts from the meaning I attached to them.'
  },
  values: {
    eyebrow: 'VALUES IN ACTION',
    title: 'Values get interesting when they cost something.',
    text: 'It is easy to value honesty, compassion, courage, or fairness when none of them are in tension.',
    prompt: 'What value do I want to be visible in my behavior here, even if this conversation is uncomfortable?',
    save: 'Ask: What value do I want to be visible in my behavior here, especially when it is uncomfortable?'
  },
  conversation: {
    eyebrow: 'THE CONVERSATION',
    title: 'Clear can be kind. Kind can still be clear.',
    text: 'Connection is not the same as making every conversation comfortable. Sometimes respect looks like saying the thing instead of making someone guess.',
    prompt: 'What needs to be said clearly? What needs to be asked curiously?',
    save: 'Before a hard conversation: What needs to be said clearly? What needs to be asked curiously?'
  },
  repair: {
    eyebrow: 'REPAIR',
    title: 'You can come back.',
    text: 'Leadership does not require getting every moment right. Repair starts when we stop defending our intention long enough to own our impact.',
    prompt: 'What can I own without explaining it away? What does the relationship need from me next?',
    save: 'Repair: What can I own without explaining it away? What does the relationship need from me next?'
  }
};

const dialog = document.getElementById('roomDialog');
const dialogContent = document.getElementById('roomDialogContent');
document.querySelectorAll('.open-room').forEach(card => card.addEventListener('click', () => {
  const room = roomPrompts[card.dataset.room];
  dialogContent.innerHTML = `
    <p class="eyebrow">${room.eyebrow}</p>
    <h2>${room.title}</h2>
    <p>${room.text}</p>
    <div class="reflection-box"><strong>Try this:</strong>${room.prompt}</div>
    <textarea aria-label="Private reflection" placeholder="Type here if you want to think it through. This text isn't sent or saved anywhere."></textarea>
    <button class="inline-action" id="saveRoomNote">Save the prompt to my notebook</button>`;
  dialog.showModal();
  document.getElementById('saveRoomNote').addEventListener('click', () => saveNote(room.eyebrow, room.save));
}));
document.getElementById('closeRoomDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

renderScenarioStart();
renderNotebook();