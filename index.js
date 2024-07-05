const editor = document.getElementById("editor");
const pseudocode = document.getElementById("pseudocode");
const domParser = new DOMParser();

if (editor.addEventListener) {
	editor.addEventListener('input', function() {
		var val = parserToHtml(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	});
}
else if (editor.attachEvent) {
	editor.attachEvent('onpropertychange', function() {
		var val = parserToHtml(this.value);
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

		var val = parserToHtml(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	}
});

const STATE = /\\State/g;
const IF = /\\If/g;
const IFELSE = /\\IF\s*\{([^}]+\})\s*\\STATE\s*\{([^}]+\})\s*\\ELSE\s*\\STATE\s*\{([^}]+\})\s*\\ENDIF/g;
const ELSE = /\\Else/g;
const ELSIF = /\\ElsIf/g;
const ENDIF = /\\EndIf/g;
const FOR = /\\For/g;
const ENDFOR = /\\EndFor/g;
const FORALL = /\\ForAll/g;
const WHILE = /\\While/g;
const REPEAT = /\\Repeat/g;
const LOOP = /\\Loop/g;
const ENDLOOP = /\\EndLoop/g;
const REQUIRE = /\\Require/g;
const ENSURE = /\\Ensure/g;
const RETURN = /\\Return/g;
const PRINT = /\\Print/g;
const COMMENT = /\\Comment/g;
const AND = /\\And/g;
const OR = /\\Or/g;
const XOR = /\\Xor/g;
const NOT = /\\Not/g;
const TO = /\\To/g;
const TRUE = /\\True/g;
const FALSE = /\\False/g;
const CURLY = /\{([^}]+\})/g;

function parserToHtml(text) {
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

		result += "<p style=\"text-indent:"+ (40*tabs) + "px\">";
		result += parser(lines[i]);	
		result += "</p>";
	}

	result += "</div>";
	
	return result;
}

function parser(expression) {
	var result = "";

	if (expression.match(IFELSE)){
		try {
			var IfExpr = expression.match(CURLY)[0].replace("\{", "").replace("\}","");
			var StateExpr = expression.match(CURLY)[1].replace("\{", "").replace("\}","");
			var ElseExpr = expression.match(CURLY)[2].replace("\}","").replace("\{","");
			result += "If " + IfExpr + " then " + StateExpr + " Else " + ElseExpr + " EndIf\n";
		}
		catch {
		}
	}
	else if (expression.match(STATE)) {
		try {
			var StateExpr = expression.split(STATE)[1];
			var Expr = StateExpr.match(CURLY)[0];
			result += Expr + "\n";
		}
		catch {
		}
	}
	else if (expression.match(IF)){
		try {
			var IfExpr = expression.split(IF)[1];
			var Expr = IfExpr.match(CURLY)[0];
			result += "If " + Expr + " then\n";
		}
		catch {
		}
	}
	else if (expression.match(ELSE)){
		try {
			var ElseExpr = expression.split(ELSE)[1];
			var Expr = ElseExpr.match(CURLY)[0];
			result += "If " + Expr + "\n";
		}
		catch {
		}
		result += "Else " + expression.split('\\Else')[1] + "\n";
	}
	else if (expression.match(ELSIF)){
		try {
			var ElsifExpr = expression.split(ELSIF)[1];
			var Expr = ElsifExpr.match(CURLY)[0];
			result += "ElseIf " + Expr + "\n";
		}
		catch {
		}
	}
	else if (expression.match(ENDIF)){
		result += "EndIf\n";
	}
	else if (expression.match(FOR)){
		result += "For" + expression.split('\\For')[1] + "\n";
	}
	else if (expression.match(FORALL)){
		result += "ForAll\n";
	}
	else if (expression.match(ENDFOR)){
		result += "EndFor\n";
	}
	else if (expression.match(WHILE)){
		result += "While\n" + expression.split('\\While')[1] + "\n";
	}
	else if (expression.match(REPEAT)){
		result += "Repeat\n" + expression.split('\\Repeat')[1] + "\n";
	}
	else if (expression.match(LOOP)){
		result += "Loop\n" + expression.split('\\Loop')[1] + "\n";
	}
	else if (expression.match(ENDLOOP)){
		result += "EndLoop\n";
	}
	else if (expression.match(REQUIRE)){
		result += "Require\n" + expression.split('\\Require')[1] + "\n";
	}
	else if (expression.match(ENSURE)){
		result += "Ensure\n" + expression.split('\\Ensure')[1] + "\n";
	}
	else if (expression.match(RETURN)){
		result += "Return\n";
	}
	else if (expression.match(PRINT)){
		result += "Print\n" + expression.split('\\Print')[1] + "\n";
	}
	else if (expression.match(COMMENT)){
		result += "Comment\n" + expression.split('\\Comment')[1] + "\n";
	}
	else if (expression.match(AND)){
		result += "And\n";
	}
	else if (expression.match(OR)){
		result += "Or\n";
	}
	else if (expression.match(XOR)){
		result += "Xor\n";
	}
	else if (expression.match(NOT)){
		result += "Not\n";
	}
	else if (expression.match(TO)){
		result += "To\n";
	}
	else if (expression.match(TRUE)){
		result += "True\n";
	}
	else if (expression.match(FALSE)){
		result += "False\n";
	}

	return result;
}
