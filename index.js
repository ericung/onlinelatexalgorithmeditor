var editor = document.getElementById("editor");
var pseudocode = document.getElementById("pseudocode");

if (editor.addEventListener) {
	editor.addEventListener('input', function() {
		var val = parser(editor.value);
		pseudocode.value = val;
		pseudocode.innerText = val;
	});
}
else if (editor.attachEvent) {
	editor.attachEvent('onpropertychange', function() {
		var val = parser(editor.value);
		pseudocode.value = val;
		pseudocode.innerText = val;
	});
}

const STATE = /\\State/g
const IF = /\\If/g 
const ELSE = /\\Else/g 
const ELSIF = /\\ElsIf/g 
const ENDIF = /\\EndIf/g

function parser(text) {
	var lines = text.split('\n');
	var result = "";

	for(var i = 0; i < lines.length; i++)
	{
		if (lines[i].match(STATE)) {
			result += lines[i].split('\\State')[1] + "\n";
		}
		else if (lines[i].match(IF)){
			result += "If " + lines[i].split('\\If')[1] + "\n";
		}
		else if (lines[i].match(ELSE)){
			result += "Else " + lines[i].split('\\Else')[1] + "\n";
		}
		else if (lines[i].match(ELSIF)){
			result += "ElseIf " + lines[i].split('\\ElsIf')[1] + "\n";
		}
		else if (lines[i].match(ENDIF)){
			result += "EndIf\n";
		}
	}

	return result;
}
