#!/usr/bin/env osascript -l JavaScript

function run() {
  var voiceOver = Application('VoiceOver');

  delay(0.1);

  var lastPhrase = '';
  if (voiceOver.captionWindow.enabled) {
    lastPhrase = voiceOver.lastPhrase.content();
  }

  delay(1);

  return lastPhrase;
}
