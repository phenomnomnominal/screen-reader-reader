#!/usr/bin/env osascript -l JavaScript

function run() {
  let se = Application('System Events');

  delay(1);

  let F5 = 96;
  se.keyCode(F5, { using: 'command down' });

  delay(1);
}
