set shell = CreateObject("WScript.Shell")
WScript.Sleep 1000
shell.Run "wmic process where name='nvda.exe' delete"
WScript.Sleep 1000
