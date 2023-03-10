// ITEM script
// item with art and artist and artist portfolio
// a working script from Feb 8 website restore

var Webflow = Webflow || [];
Webflow.push(function () {  // remove coment for production

  function myImage(itemFile, altText) {
    const img = $("<img />");
    // console.log("itemFile = ", itemFile )
    $(img).attr("alt", altText);
    $(img).attr("data-blink-src", itemFile);
    $(img).attr("width", "320");  // 280 > 320 3/4
    $(img).attr("height", "");
    //console.log("img = ", img )
    return img;
  }

  function makePortfolioSlider() {
    var portfolioSlider = new Splide("#portfolio-slider", {
      width: 600,
      height: 600,
      pagination: false,
      cover: true,
      arrows: false,
      perPage: 1,
      focus: "center",
      trimSpace: false,
    });

    var thumbnails = document.getElementsByClassName("thumbnail");
    var current;

    for (var i = 0; i < thumbnails.length; i++) {
      initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail, index) {
      thumbnail.addEventListener("click", function () {
        splide.go(index);
      });
    }

    splide.on("mounted move", function () {
      var thumbnail = thumbnails[splide.index];

      if (thumbnail) {
        if (current) {
          current.classList.remove("is-active");
        }

        thumbnail.classList.add("is-active");
        current = thumbnail;
      }
    });
    document.addEventListener("DOMContentLoaded", () =>
      portfolioSlider.mount()
    );
  }

  function mainSlider() {
	
    console.log("mainSlider reached")
    var homeSlider = new Splide(".splide.is--main", {
		 // Desktop on down      
      perPage: 1,
      perMove: 1,
      focus: "center", // 0 = left and 'center' = center
      type: "loop", // 'loop' or 'slide'
      gap: "50vw", // space between slides
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
          gap: "2vw",
        },
        767: {
          // Mobile Landscape
          perPage: 1,
          gap: "2vw",
        },
        479: {
          // Mobile Portrait
          perPage: 1,
          gap: "2vw",
        },
      },
    });
   homeSlider.mount();
  }
	

  function createArtistPortfolio(artist_portfolio) {
    var num = artist_portfolio.length;
    for (var i = 0; i < num; i++) {
      const template = $("#portfolio-main-card");
      const clone = $(template).clone();
      $(clone).show();
      var alt =
        artist_portfolio.title + " by " + artist_portfolio.artistFullName;
      var image =
        '<img class="portfolio is-portfolio img" src="' +
        artist_portfolio.file +
        '"  alt="' +
        alt +
        '" />';
      var thumbnail =
        '<img class="thumbnail is-portfolio img" src="' +
        artist_portfolio.file +
        '"  alt="' +
        alt +
        '" />';
      $(".slide-contents is-portfolio").append(image);
      $(".thumbnails").append(thumbnail);

      var framedLink = "/order-draft?SKU=" + artist_portfolio.SKU_framed;
      var framedPurchaseLink = $('<a class=" href="' + framedLink + '" ');
      var framedPrice = artist_portfolio.price - framed;
      $(".is--framed").attr("href", framedPurchaseLink);
      $(".is--framed").html("$" + framedPrice + "<br/>Framed");

      var unframedLink = "/order-draft?SKU=" + artist_portfolio.SKU;
      var unframedPurchaseLink = $('<a class=" href="' + unframedLink + '" ');
      var unframedPrice = artist_portfolio.price;
      $(".is-unframed").attr("href", unframedPurchaseLink);
      $(".is-unframed").html("$" + unframedPrice + "<br/>Unframed");

      var actingNpUrl = artist_portfolio._default_np.OrganizationURL;
      var actingNpName = artist_portfolio._default_np.name;
      if (artist_portfolio._selecting_np.id !== 0) {
        actingNpUrl = artist_portfolio._selecting_np.OrganizationURL;
        actingNpName = artist_portfolio._selecting_np.name;
      }
      $(".np-link-default is-large").attr("href", actingNpUrl);
      $(".np-link-default is-large").html(actingNpName);
    }
    $("#portfolio-main-card").remove();
    document.addEventListener("DOMContentLoaded", () =>
      splidePortfolio.mount()
    );
  }
	
  function checkBioImage(artist) {
    const artistBioImage = artist && artist.artistBioImage; // check for null values
    if (artistBioImage) {
		  $(".bio-pic-image img:last-child").remove();
      $(".bio-pic-image").append('<img src="' + artistBioImage + '"/>');
    }
  }

  function artAndArtist(artwork, artist) { // static slide
    checkBioImage(artist);
    let artistBio = "The artist has not provided a biography";
    artistBio = artist && artist.artistBio; // check for null values
    artistBio = artistBio.substring(0, 300);
    let edition_size = "The artist has not provided a edition size";
    edition_size = artwork && artwork.edition_size; // check for null values
    let description = "The artist has not provided a description";
    description = artwork && artwork.description; // check for null values
    description = description.substring(0, 300);

    $(".artist-bio.is--artist").text(artistBio);
    $(".edition_size").text(edition_size);
    $(".description").text(description);
		$(".sample-hero-image.is--artist img:last-child").remove()
    $(".sample-hero-image.is--artist").append('<img src="' + artwork.file + 'alt="' + description  + 'width="500"' + '"/>');		
    $(".splide-title.is--artist").text(artwork.title); 
    $(".splide-artist.is--artist").text('Artist: ' + artwork.artistFullName); 
    $(".dimensions.is--artist").text('Dimensions: ' + artwork.width + ' x ' + artwork.height ); 
    $(".artist-bio").text(artistBio);
  }

  async function getPortfolio() {
    var artId = 264; // default value
    var myUrl = new URL(document.location.href);
    // var artId = myUrl.searchParams.get("artId");
    if (myUrl.searchParams.get("artId")) {
      artId = myUrl.searchParams.get("artId");
    } // check for null values
    //
    const requestURL =
      "https://xkwy-af3e-bx9m.n7.xano.io/api:arLEd2EP:v1/item_artwork?artId=" + artId;
    // console.log("artId = ", artId)
    const result = await fetch(requestURL); //
    const obj = await result.json(); //

    const artwork = obj.artwork;
    const artist = obj.artist;
    const artist_portfolio = obj.artist_portfolio;
    const nonprofit = obj.nonprofit;
    const nonprofit_portfolio = obj.nonprofit_portfolio;
    const businesses_donating = obj.businesses_donating;
    const supporting_artists = obj.supporting_artists;
    console.log("artist = ", artist);
    console.log("artist = ", artwork);
    await artAndArtist(artwork, artist);
    // await createArtistPortfolio(artist_portfolio);
    await mainSlider();
    //await makePortfolioSlider();
  }

  getPortfolio();
});   // remove coment for production
