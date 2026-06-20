/**
 * Demo message copy — edit this file to change inputs and outputs.
 * video.html reads from window.DEMO_COPY on load and during playback.
 */
window.DEMO_COPY = {
  input: {
    /** Scene 1 (iMessage) + Scene 3 (full message in the app) */
    hook: "hey sorry i cant make it tonight i got way too much work and honestly im just so tierd",
    /** Scenes 4–5 (shorter message shown in the app UI) */
    app: "hey sorry i cant make it tonight i am tierd",
  },
  output: {
    /** Scene 3: default “Correct” rewrite */
    correct:
      "Hey, sorry I can't make it tonight. I have way too much work and, honestly, I'm just so tired.",
    /** Scene 4–5: Flirty tone (before language change) */
    flirty:
      "so sad i can't see your pretty face tonight... come over and save me from this boring work, please! 😏💀",
    /** Scene 5: after selecting Vietnamese */
    vietnamese:
      "buồn ghê tối nay không được ngắm cậu... hãy qua đây cứu tớ khỏi đống việc chán ngắt này đi được không? 😏🥺",
  },
};

/**
 * Per-scene narration (ElevenLabs) — export ONE mp3 per segment (7 files).
 * Generate each `script` separately so pauses happen naturally between scenes
 * (typing, whoosh, UI motion fill the gaps). Does not read the caption bar.
 *
 * Optional: paste `fullScriptForElevenLabs` as one job and split the MP3
 * in an editor — segmented files sync better with the 20s demo.
 */
window.DEMO_NARRATION = {
  playbackRate: 1,
  segments: [
    {
      id: "s1",
      file: "voice-narr-01-hook.mp3",
      script:
        "Ever sent a text you immediately regretted? Yeah, we've all been there.",
      when: "Scene 1 — iMessage hook (0s)",
    },
    {
      id: "s2",
      file: "voice-narr-02-brand.mp3",
      script: "Meet Recast.",
      when: "Scene 2 — brand reveal (~3s)",
    },
    {
      id: "s3",
      file: "voice-narr-03-rewrite.mp3",
      script:
        "Paste your messy message, hit rewrite, and watch awkward turn confident.",
      when: "Scene 3 — rewrite (~5s)",
    },
    {
      id: "s4",
      file: "voice-narr-04-vibe.mp3",
      script:
        "Pick your vibe — flirty, professional, Gen Z, whatever fits the moment.",
      when: "Scene 4 — tones (~9s)",
    },
    {
      id: "s5",
      file: "voice-narr-05-languages.mp3",
      script:
        "Need another language? Rewrite in twenty-plus languages, right from advanced settings.",
      when: "Scene 5 — languages (~13s)",
    },
    {
      id: "s6",
      file: "voice-narr-06-no-app.mp3",
      script: "No app store. No signup. Just rewrite in your browser.",
      when: "Scene 6 — no app (~16s)",
    },
    {
      id: "s7",
      file: "voice-narr-07-cta.mp3",
      script:
        "Fix your texts before you send them. Try Recast — messagerewriter dot vercel dot app.",
      when: "Scene 7 — CTA (~18s)",
    },
  ],
  /** Reference only — do not export as one file unless you add silences yourself */
  fullScriptForElevenLabs: `Ever sent a text you immediately regretted? Yeah, we've all been there.

Meet Recast.
Paste your messy message, hit rewrite, and watch awkward turn confident.

Pick your vibe — flirty, professional, Gen Z, whatever fits the moment.

Need another language? Rewrite in twenty-plus languages, right from advanced settings.

No app store. No signup. Just rewrite in your browser.

Fix your texts before you send them. Try Recast — messagerewriter dot vercel dot app.`,
};
