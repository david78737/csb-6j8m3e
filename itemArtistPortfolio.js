  function build_portfolio(artist_portfolio) {
    for (const item of artist_portfolio) {
      try {
        //console.log("*****item file = ", item.file)
        $("#sampleslide").show(); // show the template card
        $("#samplethumb").show(); // show the template card
        const template = $("#sample-slide");
        const clone = $(template).clone();
        const templateThumb = $("#samplethumb");
        const clonethumb = $(templateThumb).clone();
        //console.log("+++++++///item file = ", item.file)
        $(clone).show();
        $(clonethumb).show();
        $(clone).find(".splide__slide").removeAttr('id');
        $(clonethumb).find(".thumbnail").removeAttr('id');
        const imageFile = item.file;
        //console.log("*****item file = ", item.file)
        // ***************
        $(clone).find("img.slide-image.is--portfolio").attr("src", item.file);
        $(clone).find(".title").text(item.title);
        $(clone).find(".description").text(item.description);
        $(clone).find(".price").text("Price unframed: " + "$" + item.price);
        $(clone).find(".price_framed").text("Price framed: " + "$" + item.price_framed);
        $(".splide__list").append(clone);
        // ****************
        $(clonethumb).find("img.thumb-image.is--portfolio").attr("src", item.file);
        $(".thumbnails").append(clonethumb);
        // ********************		
      } catch (e) {
        console.log("error!!!!!", e.message)
      }
    }
    $("#sample-slide").remove();
    $("#samplethumb").remove();

    var splide = new Splide("#main-slider", {
      width: 400,
      height: "",
      pagination: false,
      cover: true,
      arrows: false
    });

    var thumbnails = document.getElementsByClassName("thumbnail");
    var current;

    for (var i = 0; i < thumbnails.length; i++) {
      initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail, index) {
      thumbnail.addEventListener("click", function() {
        splide.go(index);
      });
    }

    splide.on("mounted move", function() {
      var thumbnail = thumbnails[splide.index];

      if (thumbnail) {
        if (current) {
          current.classList.remove("is-active");
        }

        thumbnail.classList.add("is-active");
        current = thumbnail;
      }
    });
    splide.mount();
  }

  function myImage(itemFile, altText) {
    const img = $("<img />");
    // console.log("itemFile = ", itemFile )
    $(img).attr("alt", altText);
    $(img).attr("data-blink-src", itemFile);
    $(img).attr("width", "280");
    $(img).attr("height", "");
    //console.log("img = ", img )
    return img;
  }

  function mainSlider() {
    var portfolioSplide = new Splide("#main-slider", {
      width: 600,
      height: 800,
      pagination: false,
      cover: true,
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
    });
    document.addEventListener("DOMContentLoaded", () => portfolioSplide.mount());
  } // end home slider
  //*****************
  function artAndArtist(artwork, artist) {
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
    $(".art-file-uuid.is--artist").attr("src", artwork.file); //
    $(".splide-title.is--artist").text(artwork.title); //
    $(".splide-artist.is--artist").text(artwork.artistFullName); //
    $(".dimensions.is--artist").text(artwork.dimensions); //
    $(".bio-pic.is--artist").text(artwork.width); //
    $(".artist-bio.is--artist").text(artwork.height); //
  }
  //*****************
  async function getPortfolio() {
    var artId = 264; // default value
    var myUrl = new URL(document.location.href);
    // var artId = myUrl.searchParams.get("artId");
    if (myUrl.searchParams.get("artId")) {
      artId = myUrl.searchParams.get("artId");
    } // check for null values
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
    console.log("artist_portfolio = ", artist_portfolio)
    build_portfolio(artist_portfolio);
    // await buildArtistPortfolio(artist_portfolio);
  }
  getPortfolio();
 
