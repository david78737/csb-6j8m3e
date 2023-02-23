/*
// JS fiddle
// Home Splide / HTML / JS 
// 2/9/2023 
*/


var Webflow = Webflow || [];
Webflow.push(function () {
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function myImage(itemFile, altText) {
  const img = $("<img />");
  $(img).attr("alt", altText);
  $(img).attr("data-blink-src", itemFile);
  $(img).attr("width", "500");
  $(img).attr("height", "");
  return img;
}

// test for logged in
const webflowMemberId = getCookie("webflowMemberId");
if (webflowMemberId == null) {
  // visitors must log in
  window.location.href = "https://www.helps-austin.com";
}

//*********** after capture click event POST to Xano
function postData(xanoAPI, data) {
  const response = fetch(xanoAPI, {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      body: JSON.stringify({
        data: data
      }), // per Ray Deck
      headers: {
        "Content-type": "application/json; charset=UTF-8",
	Authorization: "Bearer " + data.token      
      }
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log("? = " + err));
}


// this function captures the id of the clicked "like" button
// it changes the class (appearance) of the button from gray hearto to red heart
// it updates the favorites table in Xano recording
// the user / member id, artwork id, and status of the button
function updateFav(e) {
  if (e.target !== e.currentTarget) {
    // do not exicute if a nonspecific area clicked
    var clickedItem = e.target.id; // aid12345
	  
    console.log("clicked item = ",clickedItem);
    // <a id="aid271" href="#" class="likebutton false"></a>	
	  
    var artwork_id = clickedItem.substring(3); // aid12345 => 12345 or artwork record id
    // create variable for current value "liked" (true or false)
    var rawClass = $(e.target).attr("class"); // 'likebutton false' or 'likebutton true' plus stuff Webflow adds
    let start = rawClass.indexOf(" ");
    let liked = rawClass.slice(start + 1); // isolates false or true
    // toggle liked button status changes on client page
    if (liked === "false") {
      liked = "true";
      $("#" + clickedItem).prop("class", "liked-or-not true");
    } else {
      liked = "false";
      $("#" + clickedItem).prop("class", "liked-or-not false");
    }
    // POST data to Xano to update table record
    var token = localStorage.getItem("token");
    const data = {
      authToken: token,
      artworks_id: artwork_id,
      art_favorite: liked
    };
    const xanoAPI = "https://x8ki-letl-twmt.n7.xano.io/api:arLEd2EP/update_fav/";
    postData(xanoAPI, data);
  }
  e.stopPropagation();
}


function sliderHome() {
  var homeSlider = new Splide('#homeslider', {
    // Desktop on down
    perPage: 1,
    perMove: 1,
    autoHeight: true,
    focus: 0, // 0 = left and 'center' = center
    type: "loop", // 'loop' or 'slide'
    gap: "40vw", // space between slides
    arrows: "slider", // 'slider' or false
    pagination: "slider", // 'slider' or false
    speed: 600, // transition speed in miliseconds
    dragAngleThreshold: 80, // default is 30
    autoWidth: false, // for cards with differing widths
    rewind: true, // go back to beginning when reach end
    rewindSpeed: 800,
    waitForTransition: false,
    updateOnMove: true,
    trimSpace: false, // true removes empty space from end of list
    breakpoints: {
      991: {
        // Tablet
        perPage: 1,
        gap: "2vw"
      },
      767: {
        // Mobile Landscape
        perPage: 1,
        gap: "2vw"
      },
      479: {
        // Mobile Portrait
        perPage: 1,
        gap: "2vw"
      }
    }
  })
  homeSlider.mount();
}

async function getFreeArtworks() {
  let requestURL = "https://xkwy-af3e-bx9m.n7.xano.io/api:arLEd2EP/home-page";
  const result = await fetch(requestURL); 
  const obj = await result.json(); 
  const items = obj.items; 

  for (const item of items) {
    $("#sampleslide").show(); // show the template card
    const template = $("#sampleslide");
    const clone = $(template).clone();
    $(clone).show();
    $(clone).find(".splide__slide").removeAttr('id'); 
    const myartwork = item;
    const artworkID = myartwork.id;
    const aTitle = myartwork.title
    const artist = myartwork.artistFullName; 
    const dimsWidth = myartwork.width;
    const dimsHeight = myartwork.height;
    const price = myartwork.price;		
    const moreInfoURL = "item?artId=" + artworkID; ///item?artId=264
    const likedID = "aid" + artworkID;
    const imageFile = myartwork.file; 
		
		
    const altText = "artwork titled " + item.title + " by artist " + item.artistFullName + " available for a donation of $" + item.price;
    $(clone).find(".splide-title").text(item.title); 
    $(clone).find(".splide-artist").text(item.artistFullName); 
    $(clone).find(".dimensions").text('Dimensions: ' + item.width + ' x ' + item.height); 
    $(clone).find(".price").text('Price unframed: $' + item.price + ' | Price framed: $' + item.price_framed); 
    $(clone).find(".splidemoreinfo").attr("href", 'item?artId=' + item.id); 
    $(clone).find("#aid").prop({
      id: 'aid' + item.id,
      class: "likebutton false"
    });
		
    $(clone).find("img.slide-image.is--home").attr("src", item.file);
//console.log("image file = ", imageFile);
    $(clone).find("img.slide-image.is--home").attr("alt", altText);
    $(clone).show();
//console.log("item.file = ",item.file)
    $("#slideContainer").append(clone);
  }
  $("#sampleslide").remove();
  sliderHome();
}
getFreeArtworks();
 });
