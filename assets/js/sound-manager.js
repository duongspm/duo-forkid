/* ============================================
   Sound Manager — speaks Vietnamese words aloud
   using the browser's built-in speech synthesis.
   Now supports choosing a voice, rate, and pitch,
   remembered across visits via localStorage.
   ============================================ */

const SoundManager = (() => {
  const STORAGE_KEY = 'beVuiHoc_voiceSettings';

  let muted = false;
  let voices = [];
  let settings = { voiceURI: null, rate: 0.85, pitch: 1.15 };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    settings = { ...settings, ...saved };
  } catch (e) { /* ignore corrupted storage */ }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Vietnamese voices first, then everything else (some browsers have no vi-VN voice)
  function getVoices() {
    const vi = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('vi'));
    const others = voices.filter(v => !v.lang || !v.lang.toLowerCase().startsWith('vi'));
    return [...vi, ...others];
  }

  function currentVoice() {
    if (settings.voiceURI) {
      const found = voices.find(v => v.voiceURI === settings.voiceURI);
      if (found) return found;
    }
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi')) || null;
  }

  function speak(text, opts = {}) {
    if (muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = opts.rate ?? settings.rate;
    utter.pitch = opts.pitch ?? settings.pitch;
    const v = currentVoice();
    if (v) utter.voice = v;
    window.speechSynthesis.speak(utter);
  }

  function setMuted(val) { muted = val; }
  function isMuted() { return muted; }

  function setVoice(voiceURI) { settings.voiceURI = voiceURI; persist(); }
  function setRate(val) { settings.rate = val; persist(); }
  function setPitch(val) { settings.pitch = val; persist(); }
  function getSettings() { return { ...settings }; }
  
  // Real recorded sound effects (mp3), separate from text-to-speech
  let sfxAudio = null;
  function playSfx(url) {
    if (muted) return;
    if (!sfxAudio) sfxAudio = new Audio();
    sfxAudio.pause();
    sfxAudio.src = url;
    sfxAudio.currentTime = 0;
    sfxAudio.play().catch(() => { /* browser blocked autoplay or file missing */ });
  }

  return {
    speak, setMuted, isMuted,
    getVoices, setVoice, setRate, setPitch, getSettings, playSfx
  };
})();