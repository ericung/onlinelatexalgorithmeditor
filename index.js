const editor = document.getElementById("editor");
const pseudocode = document.getElementById("pseudocode");
const domParser = new DOMParser();

if (editor.addEventListener) {
	editor.addEventListener('input', function() {
		var val = parser(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	});
}
else if (editor.attachEvent) {
	editor.attachEvent('onpropertychange', function() {
		var val = parser(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	});
}

editor.addEventListener('keydown', function(e) {
	if (e.key == "Tab") {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;
		this.value = this.value.substring(0,start) + "\t" + this.value.substring(end);
		this.selectionStart = this.selectionEnd = start + 1;

		var val = parser(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
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
const LEFTCURLY = /\{/g
const RIGHTCURLY = /\}/g

function parser(text) {
	var lines = text.split('\n');
	const body = document.getElementById("pseudocode-body");
	if (body !== null) {
		body.remove();
	}
	var result = "<div id=\"pseudocode-body\">";

	for(var i = 0; i < lines.length; i++)
	{
		var tabs = 0;
		for (var t = 0; t < lines[i].length; t++) {
			if (lines[i][t] === "\t") {
				tabs++;
			}
		}

		result += "<p style=\"text-indent:"+ 40*tabs + "px\">";

		if (lines[i].match(STATE)) {
			result += lines[i].split(STATE)[1];
			result += "</p>";
		}
		else if (lines[i].match(IF)){
			var IfExpr = lines[i].split(IF)[1];
			var LeftCurl = IfExpr.split(LEFTCURLY)[1];
			var Expr = LeftCurl.split(RIGHTCURLY)[0];
			result += "If " + Expr + "\n";
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

	result += "</div>";
	
	return result;
}
