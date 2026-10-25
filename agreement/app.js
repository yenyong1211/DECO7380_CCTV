const $ = id => document.getElementById(id);
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
function motionState() {
  document.body.classList.toggle('motion-paused', paused);
  document.querySelectorAll('.step-art img,.hero-svg').forEach(img => {
    img.src = img.src.replace('-still.svg', '.svg').replace('.svg', paused ? '-still.svg' : '.svg');
  });
  $('motion').textContent = paused ? 'Play animation' : 'Pause animation';
  $('motion').setAttribute('aria-pressed', String(paused));
}
$('motion').onclick = () => { paused = !paused; motionState(); };
motionState();
$('cloud').addEventListener('change', () => {
  $('heroart').src = ($('cloud').checked ? 'journey-cloud' : 'journey') + (paused ? '-still' : '') + '.svg';
  $('heroart').alt = 'Camera to local storage to your phone. Cloud ' + ($('cloud').checked ? 'on' : 'off');
});

const scrollArea = $('overlay').querySelector('.scroll');
const confirmations = [$('confirm-read'), $('confirm-copies')];
let lastFocus, accepted = false, pendingHome = false;
let reachedEnd = false, readingDeadline = 0, readingTimer = null, modalOpen = false;
const focusables = () => [...$('overlay').querySelectorAll('button,a,input,summary,[tabindex="0"]')]
  .filter(e => !e.disabled && e.getClientRects().length);

function remainingSeconds() {
  return Math.max(0, Math.ceil((readingDeadline - performance.now()) / 1000));
}
function readyToContinue() {
  return modalOpen && reachedEnd && remainingSeconds() === 0 && confirmations.every(input => input.checked);
}
function updateReadingState() {
  const checkedCount = confirmations.filter(input => input.checked).length;
  $('confirm-all').checked = checkedCount === confirmations.length;
  $('confirm-all').indeterminate = checkedCount > 0 && checkedCount < confirmations.length;
  const remaining = remainingSeconds();
  const ready = readyToContinue();
  $('agree').disabled = !ready;
  const action = $('overlay').dataset.review === 'true' ? 'Save & Close' : 'Agree & Continue';
  $('agree').textContent = action + (remaining ? ' (' + remaining + 's)' : '');
  const todo = [];
  if (!reachedEnd) todo.push('Read to the end');
  if (!confirmations.every(input => input.checked)) todo.push('Tick both confirmations');
  if (remaining) todo.push('Wait ' + remaining + 's');
  const message = ready ? 'Ready to continue.' : todo.join(' · ') + '.';
  if ($('reading-status').textContent !== message) $('reading-status').textContent = message;
  if (!remaining && readingTimer !== null) { clearInterval(readingTimer); readingTimer = null; }
}
function checkReadingEnd() {
  if (!modalOpen) return;
  if (scrollArea.clientHeight > 0 && scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <= 3) reachedEnd = true;
  updateReadingState();
}
scrollArea.addEventListener('scroll', checkReadingEnd, {passive:true});
window.addEventListener('resize', checkReadingEnd);
scrollArea.querySelectorAll('img').forEach(img => img.addEventListener('load', checkReadingEnd));
confirmations.forEach(input => input.addEventListener('change', updateReadingState));
$('confirm-all').addEventListener('change', () => {
  confirmations.forEach(input => { input.checked = $('confirm-all').checked; });
  updateReadingState();
});

function openModal(review = false) {
  lastFocus = document.activeElement;
  $('overlay').classList.remove('hidden');
  $('login').inert = true;
  $('title').textContent = review ? 'Your data, explained' : 'Privacy Agreement';
  $('consentcopy').textContent = review
    ? 'Review the explanation and update your optional cloud choice.'
    : 'By choosing “Agree & Continue”, you acknowledge this visual explanation and the linked Privacy Policy for this prototype.';
  $('overlay').dataset.review = String(review);
  modalOpen = true;
  reachedEnd = false;
  confirmations.forEach(input => { input.checked = false; });
  readingDeadline = performance.now() + 10000;
  if (readingTimer !== null) clearInterval(readingTimer);
  readingTimer = setInterval(updateReadingState, 250);
  scrollArea.scrollTop = 0;
  updateReadingState();
  scrollArea.focus();
  requestAnimationFrame(checkReadingEnd);
}
function closeModal() {
  modalOpen = false;
  if (readingTimer !== null) clearInterval(readingTimer);
  readingTimer = null;
  $('overlay').classList.add('hidden');
  $('login').inert = false;
  if (lastFocus) lastFocus.focus();
}
function toast(text) {
  $('toast').textContent = text;
  $('toast').classList.remove('hidden');
  setTimeout(() => $('toast').classList.add('hidden'), 5000);
}
function enterHome() {
  if (!accepted) { pendingHome = true; openModal(); return; }
  window.location.assign('../prototype/#home');
}
$('agree').onclick = () => {
  // Guard the action as well as the disabled state.
  if (!readyToContinue()) { updateReadingState(); return; }
  const review = $('overlay').dataset.review === 'true';
  if (!review) accepted = true;
  closeModal();
  toast(review ? 'Preview preference saved.' : 'Agreement acknowledged in this preview. You can now continue to login.');
  if (pendingHome) { pendingHome = false; enterHome(); }
};
$('decline').onclick = () => {
  accepted = false;
  pendingHome = false;
  closeModal();
  toast('You have not agreed. Login is paused; you can review the agreement again.');
};
$('reopen').onclick = () => openModal();
$('enterhome').onclick = enterHome;
$('loginform').onsubmit = event => { event.preventDefault(); enterHome(); };
document.addEventListener('keydown', event => {
  if (!modalOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); return; }
  if (event.key === 'Tab') {
    const items = focusables(), first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
openModal();
