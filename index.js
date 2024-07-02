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

editor.addEventListener('keydown', function(e) {
	if (e.key == "Tab") {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;

		this.value = this.value.substring(0,start) + "\t" + this.value.substring(end);

		this.selectionStart = this.selectionEnd = start + 1;
	}
});

const STATE = /\\State/g
const IF = /\\If/g 
const ELSE = /\\Else/g 
const ELSIF = /\\ElsIf/g 
const ENDIF = /\\EndIf/g
const FOR = /\\For/g
const ENDFOR = /\\EndFor/g
const FORALL = /\\ForAll/g
const WHILE = /\\While/g
const REPEAT = /\\Repeat/g
const LOOP = /\\Loop/g
const ENDLOOP = /\\EndLoop/g
const REQUIRE = /\\Require/g
const ENSURE = /\\Ensure/g
const RETURN = /\\Return/g
const PRINT = /\\Print/g
const COMMENT = /\\Comment/g
const AND = /\\And/g
const OR = /\\Or/g
const XOR = /\\Xor/g
const NOT = /\\Not/g
const TO = /\\To/g
const TRUE = /\\True/g
const FALSE = /\\False/g

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
		else if (lines[i].match(FOR)){
			result += "For" + lines[i].split('\\For')[1] + "\n";
		}
		else if (lines[i].match(FORALL)){
			result += "ForAll\n";
		}
		else if (lines[i].match(ENDFOR)){
			result += "EndFor\n";
		}
		else if (lines[i].match(WHILE)){
			result += "While\n" + lines[i].split('\\While')[1] + "\n";
		}
		else if (lines[i].match(REPEAT)){
			result += "Repeat\n" + lines[i].split('\\Repeat')[1] + "\n";
		}
		else if (lines[i].match(LOOP)){
			result += "Loop\n" + lines[i].split('\\Loop')[1] + "\n";
		}
		else if (lines[i].match(ENDLOOP)){
			result += "EndLoop\n";
		}
		else if (lines[i].match(REQUIRE)){
			result += "Require\n" + lines[i].split('\\Require')[1] + "\n";
		}
		else if (lines[i].match(ENSURE)){
			result += "Ensure\n" + lines[i].split('\\Ensure')[1] + "\n";
		}
		else if (lines[i].match(RETURN)){
			result += "Return\n";
		}
		else if (lines[i].match(PRINT)){
			result += "Print\n" + lines[i].split('\\Print')[1] + "\n";
		}
		else if (lines[i].match(COMMENT)){
			result += "Comment\n" + lines[i].split('\\Comment')[1] + "\n";
		}
		else if (lines[i].match(AND)){
			result += "And\n";
		}
		else if (lines[i].match(OR)){
			result += "Or\n";
		}
		else if (lines[i].match(XOR)){
			result += "Xor\n";
		}
		else if (lines[i].match(NOT)){
			result += "Not\n";
		}
		else if (lines[i].match(TO)){
			result += "To\n";
		}
		else if (lines[i].match(TRUE)){
			result += "True\n";
		}
		else if (lines[i].match(FALSE)){
			result += "False\n";
		}
	}

	return result;
}
