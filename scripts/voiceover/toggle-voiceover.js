#!/usr/bin/env osascript -l JavaScript

function run() {
  var se = Application('System Events');

  delay(1)

  var F5 = 96;
  se.keyCode(F5, { using: 'command down' });

  delay(1);
}
