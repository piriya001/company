
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

	var homeHtml = "snippets/home-snippet.html"; //setting up homeHtml, just the URL as to where the snippet is going to sit
	var allCardiologyCategoriesUrl = "https://piriya001.github.io/company/project1/data/cardiologyCategories.json"; // URL where you can get the JSON from our server side
	var cardiologyTitleHtml = "snippets/cardiology-title-snippet.html";
	var cardiologyHtml = "snippets/cardiology-snippet.html";
	var cardiologyItemsUrl =  "https://piriya001.github.io/company/project1/data/cardiology-items"; //"https://piriya001.github.io/company/project1/data/cardiology-items.json";
	var cardiologyItemsTitleHtml = "snippets/cardiology-items-title.html";
	var cardiologyItemHtml = "snippets/cardiology-item.html";

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
	// ==> A JS request is going to be done asynchronously and it will go out to the server and bring us back some content
	// ==> So showLoading basically says give me a selector to which I should attach this loading icon. - ajaxload.info
	// ==> reusing insertHtml that we defined before, and basically inserting that into this particular selector
	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	//Return substitute of '{{propName}}'
	//with propValue in given 'string'
	// ==> Somehow we are going to grab cardiology-snippet.html as a string, we are going to grab htat using Ajax request and then, we have this entire HTML as a sting.
	// ==> Then we need to substitue every property that has double curly braces around it with a value. The function insertProperty is going to do this.
	// ==> I am asking for a string, the PropName and PropValue. And it is going to return a string already with those property values inserted, instead of the property names there.
	// ==> We are going to use a replace function of the string class and user a regular expression. It's just going to be the property to replace that property that we have set up (propToReplace).
	// ==> We want that replaced. And the only use we are using this regular expression is because we want to specify this flat g, which tells us to go ahead and replace it everywhere you fing in the string here.
	// ==> So, not just the first place you find, but everywhere you find.... propToReplace is going to be replaces with propValue
	// ==> Wo this is how we are going to  take the string, the snippet, and we can populate it with property values.
	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string
			.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}


	//On page load (before images or CSS)
	document.addEventListener("DOMContentLoaded", function (event) {

	//On first load, show home view
	// ==> Once DOM content has been loaded, we are able to execute things and basically executing queries.
	// ==> Ajax request is going to give us the home URL or the home HTML URL. That's sth we have defined previously.
	// ==> That's just the URL as to where the snippet is sitting. What is going to come back in our handler function is just some text to actually just a respone HTML
	// ==> Once it comes back, we are going to select our element with ID main-content and set its innerHTML to whatever the responseText came back to be.
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		homeHtml,
		function (responseText) {
			document.querySelector("#main-content").innerHTML = responseText;
		},
		false); // false means ==> no JSON.. because it is just an HTML snippet
	});


	//Load the Cardiology categories view
	// ==> Our LoadCardiologyCategories function is going to get triggered in order to pull all these categories into the page.
	// ==> First we are going to show our loading icon, and usually on these sites the server is going to be fast enough that you probably not even going to notice that
	// ==> loading icon kind of flashing and going away. But if the sides get a little slower or the data comes back a little slower, you will eventually see it.
	// ==> We are making our Ajax request afterward and we're using our AllCardiologyCategoriesURL, that's URL to github, and we're passing buildAndShowCardiologyHTML, 
	// ==> that is a value of a function that is defined below... And since we dont really need the true, it is default, which is going to go ahead and leave it off, which
	// ==> means that the function below, buildAndShowCardiologyHTML, will get cardiologyCategories, is going to be an object that is converted from the JSON string.
	// ==> So once this Ajax call is done and this function is calles, we end up in buildAndShowCardiologyHTML function below. 
	dc.loadCardiologyCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allCardiologyCategoriesUrl,
			buildAndShowCardiologyHTML); // we dont need the true right here, as it is default.
	};


	// Load the cardiology items view
	// 'cardiologyCategoryShort' is a short_name for a cardiologycategory
	dc.loadCardiologyItems = function (cardiologyCategoryShort) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			cardiologyItemsUrl + "-" + cardiologyCategoryShort + ".json",
			buildAndShowCardiologyItemsHTML);
	};



	//Builds HTML for the cardiology categories page based on the data from the server
	// ==> First, we need to go ahead and request the cardiology's title HTML, cardiologyTitleHtml. That is htat snippet of HTML that juts gets the Title of the cardiology category,
	// ==> and we need that string in order to append it to the rest of it. So once we get that string, I'm not ready to do mush with it yet. We need to make yet another Ajax request and
	// ==> notice that that Ajax request is sitting inside the one before. Because it only makes sense to make the second one when the first one is actually over and where in the context such that
	// ==> we could grab the result of the first one, means the cardiologyTitleHtml. We are making the following Ajax request to get the cardiologyHtml and that's that snippet, cardiology-snippet.html.
	// ==> And once we are done, we have all three pieces of data that we need. We have the cardiology Categories object that lists all the cardiology categories. We have the title of the page, the snippet of the
	// ==> title of the page as a string and we have a single cardiologyHtml snippet that we could now use, so all we need to to now is maybe call some function like buildCardiologyViewHtml. So now we actually
	// ==> buikding the view. Pass it the cardiologyCategories object, pass it our title snippet cardiologyTitleHtml, and pass it our actual cardiology category snippet cardiologyHtml. We are
	// ==> going to go ahead and build that view, store it inside a variable cardiologyViewHtml. and once we are done with that synchronous call, we are going to use our inserHtml
	// ==> to place it inside the element with ID main-content and there is that string cardiologyViewHtml that we are placing inside of it. 
	// ==> And notice, both Ajay calls pass false, because we dont want the Ajax utility to try to process our snippet, our html snippets as JSON.
	function buildAndShowCardiologyHTML (cardiologyCategories) {
		//Load title snippet of cardiology categories page
		$ajaxUtils.sendGetRequest(
			cardiologyTitleHtml,
			function (cardiologyTitleHtml) {
				//Retrieve single cardiology category snippet
				$ajaxUtils.sendGetRequest(
					cardiologyHtml,
					function (cardiologyHtml) {
						var cardiologyViewHtml =
							buildCardiologyViewHtml(cardiologyCategories,
													cardiologyTitleHtml,
													cardiologyHtml);
							insertHtml("#main-content", cardiologyViewHtml);
					},
					false);
			},
			false);
	}

	//Using cardiology categories data and snippets html
	//build cardiology categories vies HTML to be inserted into page
	// ==> buildCardiologyViewHtml it's a simple function. It goes ahead and builds up our final HTML snippet ba grabbing the categories first
	// ==> Remember we need to put that whole thing into our row, so rememeber that section piece is not really here anymore because it only comes once.
	// ==> We are inserting a section with a class row and then we are looping over our cardiologyCategories object and every time we pull our the name, the short name,
	// ==> and all we are doing then is just insertProperty. (Remember that insertProperty function - We insert property and every place where there is a name property inside our snippet,
	// ==> it gets replaced with the value name, same for short name.) Finally we are done and we are looping over this every single time.
	// ==> And notice that every time we are copying the cardiologyCategory HTML, that's that snippet that has the properties in it, into HTML, which means we are separating.
	// ==> This is copied by value (not by reference), which means this is a opy that is not connected to this anymore. So every time through the loop, we get a new copy of it right here and then
	// ==> we can insert the new values to it it once again. And once we are done, we ust return our final HTML that's built up, we close the section tag. Then it goes back to cardiologyViewHtml in 
	// ==> buildAndShowCardiologyHTML function and just inserts that inside our main content.
	function buildCardiologyViewHtml(cardiologyCategories,
									cardiologyTitleHtml,
									cardiologyHtml) {

		var finalHtml = cardiologyTitleHtml;
		finalHtml += "<section class='row'>";

		//Loop over categories
		for (var i = 0; i < cardiologyCategories.length; i++) {
			//insert category values
			var html = cardiologyHtml;
			var name = "" + cardiologyCategories[i].name;
			var short_name = cardiologyCategories[i].short_name;
			html =
				insertProperty(html, "name", name);
			html =
				insertProperty(html,
								"short_name",
								short_name);
			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}


	// Builds HTML for the single cardiology category page based on the data from the server
	function buildAndShowCardiologyItemsHTML (CardiologyCategoryItems) {
		//Load title snippet of cardiology items page
		$ajaxUtils.sendGetRequest(
			cardiologyItemsTitleHtml,
			function (cardiologyItemsTitleHtml) {
				//Retrieve single category item snippet
				$ajaxUtils.sendGetRequest(
					cardiologyItemHtml,
					function (cardiologyItemHtml) {
						var CardiologyItemsViewHtml =
							buildCardiologyItemsViewHTML(CardiologyCategoryItems,
														 cardiologyItemsTitleHtml,
														 cardiologyItemHtml);
							insertHtml("#main-content", CardiologyItemsViewHtml);
				},
				false);
		},
		false);
	}

	// Using Cardiology categories and Cardiology items data and snippets html
	// Build cardiology items view HTML to be inserted into page
	function buildCardiologyItemsViewHTML(CardiologyCategoryItems,
										  cardiologyItemsTitleHtml,
										  cardiologyItemHtml) {

		cardiologyItemsTitleHtml = 
			insertProperty(cardiologyItemsTitleHtml,
							"name", 
							CardiologyCategoryItems.category.name);
		cardiologyItemsTitleHtml = 
			insertProperty(cardiologyItemsTitleHtml,
							"special_category", 
							CardiologyCategoryItems.category.special_category);	

		var finalHtml = cardiologyItemsTitleHtml;
		finalHtml += "<section class='row'>";

		//Loop over cardiology items
		var cardiologyItems = CardiologyCategoryItems.cardiology_items;
		var cCatShortName = CardiologyCategoryItems.category.short_name;
		for (var i = 0; i < cardiologyItems.length; i++) {
			// insert category items values
			var html = cardiologyItemHtml;
			html = 
				insertProperty(html, "short_name", cardiologyItems[i].short_name);
			html = 
				insertProperty(html, "cCatShortName", cCatShortName);

			html = 
				insertItemPrice(html,
								"price_small",
								cardiologyItems[i].price_small);
			html = 
				insertItemPortionName(html,
								"small_portion_name",
								cardiologyItems[i].small_portion_name);
			html = 
				insertItemPrice(html,
								"price_large",
								cardiologyItems[i].price_large);
			html = 
				insertItemPortionName(html,
								"large_portion_name",
								cardiologyItems[i].large_portion_name);
			html =
				insertProperty(html,
								"name",
								cardiologyItems[i].name);
			html =
				insertProperty(html,
								"description",
								cardiologyItems[i].description);

			// Add clearfix after every second cardiology item
			if (i % 2 != 0) {
				html +=
					"<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}

	// Appends price with '$' if price exists
	function insertItemPrice(html, pricePropName, priceValue) {
		// If not specified, replace with empty string
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}

		priceValue = "$" + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	// Appends protion name in parens if it exists
	function insertItemPortionName(html, portionPropName, portionValue){
		// If not specified, return original string
		if (!portionValue) {
			return insertProperty(html, portionPropName, "");
		}

		portionValue = "(" + portionValue + ")";
		html = insertProperty(html, portionPropName, portionValue);
		return html;
	}






	global.$dc = dc; // Whatever we attach to the dc as a property is going to get exposed to the gloabal object in order for us to use it in some other page or some other script

})(window);
























