#!/usr/bin/env osascript -l JavaScript

function run() {
  let voiceOver = Application('VoiceOver');

  delay(0.1);

  let lastPhrase = '';
  if (voiceOver.captionWindow.enabled) {
    lastPhrase = voiceOver.lastPhrase.content();
  }

  delay(1);

  return lastPhrase;
}
