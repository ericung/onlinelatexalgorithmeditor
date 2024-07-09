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

const STATE = /\\STATE/g;
const IF = /\\IF/g;
const IFELSE = /\\IF\s*\{([^}]+\})\s*\\STATE\s*\{([^}]+\})\s*\\ELSE\s*\\STATE\s*\{([^}]+\})\s*\\ENDIF/g;
const ELSE = /\\ELSE/g;
const ELSIF = /\\ELSIF/g;
const ENDIF = /\\ENDIF/g;
const FOR = /\\FOR/g;
const ENDFOR = /\\ENDFOR/g;
const FORALL = /\\FORALL/g;
const WHILE = /\\WHILE/g;
const REPEAT = /\\REPEAT/g;
const LOOP = /\\LOOP/g;
const ENDLOOP = /\\ENDLOOP/g;
const REQUIRE = /\\REQUIRE/g;
const ENSURE = /\\ENSURE/g;
const RETURN = /\\RETURN/g;
const PRINT = /\\PRINT/g;
const COMMENT = /\\COMMENT/g;
const AND = /\\AND/g;
const OR = /\\OR/g;
const XOR = /\\XOR/g;
const NOT = /\\NOT/g;
const TO = /\\TO/g;
const TRUE = /\\TRUE/g;
const FALSE = /\\FALSE/g;
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
			var IfExpr = clean(expression.match(CURLY)[0]);
			var StateExpr = clean(expression.match(CURLY)[1]);
			var renderedStateExpr = katex.renderToString(StateExpr, {
				throwOnError: false
			});
			var ElseExpr = clean(expression.match(CURLY)[2]);
			var renderedElseExpr = katex.renderToString(ElseExpr, {
				throwOnError: false
			});
			result += "If " + IfExpr + " then " + renderedStateExpr + " Else " + renderedElseExpr + " EndIf\n";
		}
		catch {
		}
	}
	else if (expression.match(STATE)) {
		try {
			var StateExpr = clean(expression.split(STATE)[1]);
			var renderedStateExpr = katex.renderToString(StateExpr, {
				throwOnError: false
			});
			result += renderedStateExpr + "\n";
		}
		catch {
		}
	}
	else if (expression.match(IF)){
		try {
			var IfExpr = clean(expression.split(IF)[1]);
			result += "If " + IfExpr + " then\n";
		}
		catch {
		}
	}
	else if (expression.match(ELSE)){
		try {
			var ElseExpr = clean(expression.split(ELSE)[1]);
			result += "If " + ElseExpr + "\n";
		}
		catch {
		}
	}
	else if (expression.match(ELSIF)){
		try {
			var ElsifExpr = clean(expression.split(ELSIF)[1]);
			result += "ElseIf " + ElsifExpr + "\n";
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

function clean(expression) {
	return expression.replace("\{", "").replace("\}", "");
}
