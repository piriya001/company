
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


	//Remove the class 'active' from home and swith to Cardiology button
	var switchCardiologyToActive = function () {
		// Remove 'active' from home button
		var classes = document.querySelector("#navHomeButton").className; // We are getting the class name. and the class name is not on class name, its really just the class attribute and the class attribute can have many classes.
		classes = classes.replace(new RegExp("active", "g"), "");
		document.querySelector("#navHomeButton").className = classes;

		// Add 'active' to menu button if not already there
		classes = document.querySelector("#navCardiologyButton").className; // grabbing the classnames inside the navCardiologyButton
		if (classes.indexOf("active") == -1) { 		// this function indexOf returns -1, if it cannot find the string inside the string that you are applying this method on.
			classes += " active";
			document.querySelector("#navCardiologyButton").className = classes;
		}
	};




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
	// ==> It's basically almost the same as dc.loadCardiologyCategories, except that when we make the Ajax request, we are taking the category items URL
	// ==> while we appending '-', the short name that was passed to us through the HTML snippet and '.json'. 
	// ==> Remember the HTML snippet, the cardiology-snippet.html, when it dc.loadCardiologyItems, and it passes the short name right there. Well this is the one we are looking at right now. 
	dc.loadCardiologyItems = function (cardiologyCategoryShort) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			cardiologyItemsUrl + "-" + cardiologyCategoryShort + ".json", // Our URL that we are making Ajax request ist now complete when we put those 4 parts/pieces together.
			buildAndShowCardiologyItemsHTML); // We are also designating in a function that is going to process the result of that Ajax request. And again, it's going to be JSON so we dont need to put flase.
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
						// Switch CSS class active to menu button
						switchCardiologyToActive();

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
	// ==> Basically, we know that cardiologyCategoryItems is going to be an object, that's going to get returned because our JSON is going to get processed.
	// ==> Building up our CardiologyItemsViewHtml. and again we are passing that CardiologyCategoryItems, passing the HTML snippet for the title, and passing the HTML snippet for the ony single cardiology category Item.
	// ==> Once that gets built up and saved into CardiologyItemsViewHtml, all we have to do is insert it into an element with an ID main-content and we are done.
	// ==> And again, false false for both ajax request, because both of those Ajax requests dont need to process these snippets as JSON. They need to process them as just the regular strength.
	// ==> Now, let's take a look at buildCardiologyItemsViewHTML function below.
	function buildAndShowCardiologyItemsHTML (CardiologyCategoryItems) {
		//Load title snippet of cardiology items page
		$ajaxUtils.sendGetRequest(
			cardiologyItemsTitleHtml,
			function (cardiologyItemsTitleHtml) {
				//Retrieve single category item snippet
				$ajaxUtils.sendGetRequest(
					cardiologyItemHtml,
					function (cardiologyItemHtml) {
						// Switch CSS class active to menu button
						switchCardiologyToActive();

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
	// ==> Unlike the previously similar function, we actually need to insert some values inside of our title as well. So, in this case, it's going to be name and special_category.
	// ==> The name and special_category come from CardiologyCategoryItems.That's that object that was returned for us from github as our JSON that was converted into an Object .category, and our property .name. (CardiologyCategoryItems.category.name)
	// ==> And the same thing with CardiologyCategoryItems.category.special_category. So, once we insert that, our cardiologyItemsTitleHtml is actually ready to be used for our final HTML. That's why we are starting this final HTML with this particular
	// ==> variable that's already kind of pre-inserted with the values of our onject. 
	// ==> And again starting the section as a row, this is something we stripped our of that particular snippet because, this is only one of these lines and that snippet is going to get repeated over and over again for every single item in the cardiology category.
	// ==> Once we are done with that, we are looping over the categories items.
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
			// insert cardiolgy category items 
			var html = cardiologyItemHtml;
			html = 
				insertProperty(html, "short_name", cardiologyItems[i].short_name);
			html = 
				insertProperty(html, "cCatShortName", cCatShortName);

			// ==> Whe have different functions for insertItemPrice and insertItemPortionName. See the functions below.
			// html = 
			// 	insertItemPrice(html,
			// 					"price_small",
			// 					cardiologyItems[i].price_small);
			// html = 
			// 	insertItemPortionName(html,
			// 					"small_portion_name",
			// 					cardiologyItems[i].small_portion_name);
			// html = 
			// 	insertItemPrice(html,
			// 					"price_large",
			// 					cardiologyItems[i].price_large);
			// html = 
			// 	insertItemPortionName(html,
			// 					"large_portion_name",
			// 					cardiologyItems[i].large_portion_name);


			html =
				insertProperty(html,
								"name",
								cardiologyItems[i].name);
			html =
				insertProperty(html,
								"description",
								cardiologyItems[i].description);

			// Add clearfix after every second cardiology item
			// ==> Remember the clearfix, right? we cant control how large our caetgor items description are going to be. Some might be too large, some might be too short, and we dont want our grid to be messed up.
			// ==> So what we need to do is, after every second cardiology category item resp. after every sedong grid cell, we need to place this clear fix HTML and thats what we are doing here.
			// ==> We are using actually the remainder function or the remainder operator in Javascript. So, we are saying i remainder of 2, division of 2. And we are saying, it that's not equal to 0, meaning there is a remainder.
			// ==> So we have item 0, item 1, item 2, item 3 and so on. Well item 0 is our first item, because it's a 0, our arrays are 0 based. Item 0 is our first item and item 1 is our second item.
			// ==> And it's after the secont item that we need to place our clearfix html. Well that means that every odd (=ungerade) number resp every odd number index is where we need to append this clearfix html to. And if it is, we do, and we move on.
			if (i % 2 != 0) {
				html +=
					"<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml; // this final html gets saved into this buildCardiologyItemsViewHTML and gets inserted into our main content.
	}

	// // Appends price with '$' if price exists
	// // ==> reason for seperate functions for insertItemPrice and insertItemPortionName is because not every time we have a price, e.g. a price for a smaller portion might not even exist.
	// // ==> So we first check, whether that thing even exists, if it exists we are inserting the property (small_portion_name, large_portion_name, price_small, price_large) with its value and if it doesnt exist, what we insert instead of 
	// // ==> that we are substituiting with an empty string, so basically just wiping it out, so nothing is in that particular snippet with that value if that 
	// // ==> value doesnt exist. (obviously, we cant just leave that curly braces, a small portion price value or property inside our snippet - we dont want that showing up to the user.)
	// function insertItemPrice(html, pricePropName, priceValue) {
	// 	// If not specified, replace with empty string
	// 	if (!priceValue) {
	// 		return insertProperty(html, pricePropName, "");
	// 	}
	// // ==> If the value exists, we are going ahead and formatting our price to be a proper dollar amount. and we use toFixed(2) ==> 2 nachkommastellen
	// // ==> And then we are using our insert property as before in order to put that in. (And so that's in the case that the price value actually exists, if not, we will insert an empty string.
	// 	priceValue = "$" + priceValue.toFixed(2);
	// 	html = insertProperty(html, pricePropName, priceValue);
	// 	return html;
	// }


	// // Appends protion name in parens if it exists
	// // ==> sometimes portion doesnt exist in that type, particular value. So large poriton may not exist or small portion may not exist. So thats why we need to send it through a special function.
	// // ==> same resp similar though as in insertItemPrice function.
	// function insertItemPortionName(html, portionPropName, portionValue){
	// 	// If not specified, return original string
	// 	if (!portionValue) {
	// 		return insertProperty(html, portionPropName, "");
	// 	}
	// // ==> if the value exists, we are going ahead and put braces around the portion value. 
	// // ==> And then we are using our insert property as before in order to put that in.
	// 	portionValue = "(" + portionValue + ")";
	// 	html = insertProperty(html, portionPropName, portionValue);
	// 	return html;
	// }






	global.$dc = dc; // Whatever we attach to the dc as a property is going to get exposed to the gloabal object in order for us to use it in some other page or some other script

})(window);
























