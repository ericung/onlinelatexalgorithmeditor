var editor = document.getElementById("editor");
var pseudocode = document.getElementById("pseudocode");

if (editor.addEventListener) {
	editor.addEventListener('input', function() {
		pseudocode.value = editor.value;
		pseudocode.innerText = editor.value;
	});
}
else if (editor.attachEvent) {
	editor.attachEvent('onpropertychange', function() {
		pseudocode.value = editor.value;
		pseudocode.innerText = editor.value;
	});
}
