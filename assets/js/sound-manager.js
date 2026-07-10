/* ============================================
   Sound Manager — speaks Vietnamese words aloud
   using the browser's built-in speech synthesis.
   (Swap `speak()` internals for real audio files
   later without touching call sites.)
   ============================================ */

const SoundManager = (() => {
  let muted = false;
  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi')) || null;
  }

  function speak(text, { rate = 0.85, pitch = 1.15 } = {}) {
    if (muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = rate;
    utter.pitch = pitch;
    const v = pickVoice();
    if (v) utter.voice = v;
    window.speechSynthesis.speak(utter);
  }

  function setMuted(val) { muted = val; }
  function isMuted() { return muted; }

  return { speak, setMuted, isMuted };
})();
