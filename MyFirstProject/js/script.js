
//This is just to make the collapsable button collapse the menu when it loses focus.
$(function () { //Same as document.addEventListener(DOMContentLoaded"...

	//Same as document.querySelector("#navbarToggle").addEventListener("blur",...
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
	// In Firefox and Safari, the click event doesn't retain the focus
	// on the clicked button. Therefore, the blur event will not fire on
	// user clicking somewhere else in the page and the blur event handler
	// which is set up above will not be called.
	// Refer to issue #28 in the repo.
	// Solution: force focus on the element that the click event fired on
	$("#navbarToggle").click(function (event) {
		$(event.target).focus();
	});
});

//IIFE
(function (global) {

	var dc = {}; //namespace

	//Convenience function for inserting innner HTML for 'select'
	// ==> convenience method, so we dont have to write this from scratch every time because we are goint to have to do this several times. 
	// ==> If you give me a selector and you give me the HTML, I will go ahead and take, select that selector.
	// ==> Take that argument, grab that element I should say, the target element, and set its inner HTML to whatever the HTML string that you send me.
	// ==> So this is just a convenience method to say, insertHTtml, pass it a selector, and the HTML string and it will insert it into the target element.
	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	//Show loading icon inside element identified by 'selector'.
	/*var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};*/

	//Return substitute of '{{propName}}'
	//with propValue in given 'string'
	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string
			.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}


	






	global.$dc = dc; // Whatever we attach to the dc as a property is going to get exposed to the gloabal object in order for us to use it in some other page or some other script

})(window);


























