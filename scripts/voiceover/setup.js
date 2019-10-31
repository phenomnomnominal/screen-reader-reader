#!/usr/bin/env osascript -l JavaScript

function run() {
  var se = Application('System Events');

  delay(1);

  let ESC = 56;
  se.keyCode(ESC);

  delay(1);

  var voiceOver = Application('VoiceOver');

  delay(1);

  voiceOver.captionWindow.enabled();

  delay(1);
}
