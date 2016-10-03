
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
 	
 	//snippets
	var bannerHome = "snippets/home/banner-snippet/banner-snippet.html";
	var whyMedobalHome = "snippets/home/whyMedobal-snippet/whyMedobal-snippet.html";
	//featuredProcedure
		var featuredProcedureHomeStart = "snippets/home/featuredProcedure-snippet/featuredProcedure-snippet-start.html";
		var featuredProcedureHomeMid = "snippets/home/featuredProcedure-snippet/featuredProcedure-snippet-mid.html";
		var featuredProcedureHomeEnd = "snippets/home/featuredProcedure-snippet/featuredProcedure-snippet-end.html";
	var needHelpSupportHome = "snippets/home/needHelpSupport-snippet/needHelpSupport-snippet.html";
	//featuredDestination
		var featuredDestinationHomeStart = "snippets/home/featuredDestination-snippet/featuredDestination-snippet-start.html";
		var featuredDestinationHomeMid = "snippets/home/featuredDestination-snippet/featuredDestination-snippet-mid.html";
		var featuredDestinationHomeEnd = "snippets/home/featuredDestination-snippet/featuredDestination-snippet-end.html";
	var quoteStandard = "snippets/quote-snippet/quote-snippet.html";
	//featuredBlogTopics
		var featuredBlogTopicsStart = "snippets/featuredBlogTopics-snippet/featuredBlogTopics-snippet-start.html";
		var featuredBlogTopicsMid = "snippets/featuredBlogTopics-snippet/featuredBlogTopics-snippet-mid.html";
		var featuredBlogTopicsEnd = "snippets/featuredBlogTopics-snippet/featuredBlogTopics-snippet-end.html";



	//Json
	var featuredProcedureJSON = "https://piriya001.github.io/company/MyFirstProject/data/featured/featured_procedure.json";
	var featuredDestinationJSON = "https://piriya001.github.io/company/MyFirstProject/data/featured/featured_destination.json";
	var featuredBlogTopicsJSON = "https://piriya001.github.io/company/MyFirstProject/data/featured/featured_blogTopics.json";

	//Convenience function for inserting innner HTML for 'select'
	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	//Show loading icon inside element identified by 'selector'.
	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	//Return substitute of '{{propName}}'
	//with propValue in given 'string'
	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string
			.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}


document.addEventListener("DOMContentLoaded", function (event) {

//Load section #banner in home (index.html)
showLoading("#banner");
$ajaxUtils.sendGetRequest(
  bannerHome,
  function (responseText) {
    document.querySelector("#banner")
      .innerHTML = responseText;
  },
  false);

//Load section #whyMedobal in home (index.html)
showLoading("#whyMedobal");
$ajaxUtils.sendGetRequest(
  whyMedobalHome,
  function (responseText) {
    document.querySelector("#whyMedobal")
      .innerHTML = responseText;
  },
  false);

//Load section #featuredProcedure in home (index.html)
showLoading("#featuredProcedure");
$ajaxUtils.sendGetRequest(
  featuredProcedureJSON,
  buildAndShowFeaturedProcedure);


//Load section #needHelpSupport in home (index.html)
showLoading("#needHelpSupport");
$ajaxUtils.sendGetRequest(
  needHelpSupportHome,
  function (responseText) {
    document.querySelector("#needHelpSupport")
      .innerHTML = responseText;
  },
  false);

//Load section #featuredDestination in home (index.html)
showLoading("#featuredDestination");
$ajaxUtils.sendGetRequest(
  featuredDestinationJSON,
  buildAndShowFeaturedDestination);


//Load section #quote 
showLoading("#quote");
$ajaxUtils.sendGetRequest(
  quoteStandard,
  function (responseText) {
    document.querySelector("#quote")
      .innerHTML = responseText;
  },
  false);

//Load section #featuredBlogTopics 
showLoading("#featuredBlogTopics");
$ajaxUtils.sendGetRequest(
  featuredBlogTopicsJSON,
  buildAndShowFeaturedBlogTopics);


}); // document.addEventListener

	




//FeaturedProcedure
function buildAndShowFeaturedProcedure (featured_procedure) {
  // Load featuredProcedureHomeStart snippet 
  $ajaxUtils.sendGetRequest(
    featuredProcedureHomeStart,
    function (featuredProcedureHomeStart) {
      // Load featuredProcedureHomeMid snippet 
      $ajaxUtils.sendGetRequest(
        featuredProcedureHomeMid,
        function (featuredProcedureHomeMid) {
        	// Load featuredProcedureHomeEnd snippet 
        	$ajaxUtils.sendGetRequest(
		        featuredProcedureHomeEnd,
		        function (featuredProcedureHomeEnd) {
          

		          var featuredProcedureViewHtml =
		            buildFeaturedProcedureViewHtml(featured_procedure,
		            						featuredProcedureHomeStart,
		                                    featuredProcedureHomeMid,
		                                    featuredProcedureHomeEnd);
		          insertHtml("#featuredProcedure", featuredProcedureViewHtml);
		    },
        	false);
        },
        false);
    },
    false);
}
function buildFeaturedProcedureViewHtml(featured_procedure,
	            						featuredProcedureHomeStart,
	                                    featuredProcedureHomeMid,
	                                    featuredProcedureHomeEnd) {

  var finalHtml = featuredProcedureHomeStart;

  // Loop over categories
  for (var i = 0; i < featured_procedure.length; i++) {

  	if (i == 0) {
    	finalHtml += "<div class='item active'>";
    } else {
      	finalHtml += "<div class='item'>";
    }

    // Insert values
    var html = featuredProcedureHomeMid;
    var name = featured_procedure[i].name;
    var description = featured_procedure[i].description;

    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html, "description", description);
    
    finalHtml += html;
  }

  finalHtml += featuredProcedureHomeEnd;
  return finalHtml;
}
//End FeaturedProcedure

//FeaturedDestination
function buildAndShowFeaturedDestination (featured_destination) {
  // Load featuredDestinationHomeStart snippet 
  $ajaxUtils.sendGetRequest(
    featuredDestinationHomeStart,
    function (featuredDestinationHomeStart) {
      // Load featuredDestinationHomeMid snippet 
      $ajaxUtils.sendGetRequest(
        featuredDestinationHomeMid,
        function (featuredDestinationHomeMid) {
        	// Load featuredDestinationHomeEnd snippet 
        	$ajaxUtils.sendGetRequest(
		        featuredDestinationHomeEnd,
		        function (featuredDestinationHomeEnd) {
          

		          var featuredDestinationViewHtml =
		            buildFeaturedDestinationViewHtml(featured_destination,
		            						featuredDestinationHomeStart,
		                                    featuredDestinationHomeMid,
		                                    featuredDestinationHomeEnd);
		          insertHtml("#featuredDestination", featuredDestinationViewHtml);
		    },
        	false);
        },
        false);
    },
    false);
}
function buildFeaturedDestinationViewHtml(featured_destination,
		            						featuredDestinationHomeStart,
		                                    featuredDestinationHomeMid,
		                                    featuredDestinationHomeEnd) {

  var finalHtml = featuredDestinationHomeStart;

  // Loop over categories
  for (var i = 0; i < featured_destination.length; i++) {

  	if (i == 0) {
    	finalHtml += "<div class='item active'>";
    } else {
      	finalHtml += "<div class='item'>";
    }

    //insert values
    var html = featuredDestinationHomeMid;
    var name = featured_destination[i].name;
    //contentlist hinzufüege

    html =
      insertProperty(html, "name", name);
    //contentlist ifüeue
    
    finalHtml += html;
  }

  finalHtml += featuredDestinationHomeEnd;
  return finalHtml;
}
//End FeaturedDestination

//FeaturedBlogTopics
function buildAndShowFeaturedBlogTopics (featured_blogTopics) {
  // Load featuredBlogTopicsStart snippet 
  $ajaxUtils.sendGetRequest(
    featuredBlogTopicsStart,
    function (featuredBlogTopicsStart) {
      // Load featuredBlogTopicsMid snippet 
      $ajaxUtils.sendGetRequest(
        featuredBlogTopicsMid,
        function (featuredBlogTopicsMid) {
        	// Load featuredBlogTopicsEnd snippet 
        	$ajaxUtils.sendGetRequest(
		        featuredBlogTopicsEnd,
		        function (featuredBlogTopicsEnd) {
          

		          var featuredBlogTopicsViewHtml =
		            buildFeaturedBlogTopicsViewHtml(featured_blogTopics,
		            						featuredBlogTopicsStart,
		                                    featuredBlogTopicsMid,
		                                    featuredBlogTopicsEnd);
		          insertHtml("#featuredBlogTopics", featuredBlogTopicsViewHtml);
		    },
        	false);
        },
        false);
    },
    false);
}

function buildFeaturedBlogTopicsViewHtml(featured_blogTopics,
								 featuredBlogTopicsStart,
                                 featuredBlogTopicsMid,
                                 featuredBlogTopicsEnd) {

  var finalHtml = featuredBlogTopicsStart;

  // Loop over categories
  for (var i = 0; i < featured_blogTopics.length; i++) {
    // Insert values
    var html = featuredBlogTopicsMid;
    var topic_heading = featured_blogTopics[i].topic_heading;

    html =
      insertProperty(html, "topic_heading", topic_heading);
    
    finalHtml += html;
  }

  finalHtml += featuredBlogTopicsEnd;
  return finalHtml;
}
//End FeaturedBlogTopics




	global.$dc = dc; // Whatever we attach to the dc as a property is going to get exposed to the gloabal object in order for us to use it in some other page or some other script

})(window);


























