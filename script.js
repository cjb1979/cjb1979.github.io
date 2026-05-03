// Wait for the document to load before running the script 
(function ($) {
  
  // We use some Javascript and the URL #fragment to hide/show different parts of the page
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Linking_to_an_element_on_the_same_page
  $(window).on('load hashchange', function(){
    
    // First hide all content regions, then show the content-region specified in the URL hash 
    // (or if no hash URL is found, default to first menu item)
    $('.content-region').hide();
    
    // Remove any active classes on the main-menu
    $('.main-menu a').removeClass('active');
    var region = location.hash.toString() || $('.main-menu a:first').attr('href');
    
    // Now show the region specified in the URL hash
    $(region).show();
    
    // Highlight the menu link associated with this region by adding the .active CSS class
    $('.main-menu a[href="'+ region +'"]').addClass('active'); 

    // Alternate method: Use AJAX to load the contents of an external file into a div based on URL fragment
    // This will extract the region name from URL hash, and then load [region].html into the main #content div
    // var region = location.hash.toString() || '#first';
    // $('#content').load(region.slice(1) + '.html')
    
  });
  
})(jQuery);

(function ($) {
  $(document).ready(function() {
    const $contact_div = $('#contact');  
    let currentHTML = $contact_div.html();
    const em = ['hi','@','cj','-','boyd','.','com'].join('');
    const computed = currentHTML.replace('email_address', em);
    $contact_div.html(computed);
  });
})(jQuery);

const container = document.getElementById('slideshow');
const images = JSON.parse(container.dataset.images);
let currentIndex = 0;

// 1. Preload Function
const preloadImages = (srcs) => {
  const promises = srcs.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  return Promise.all(promises);
};

// 2. Start the Cycle
const startSlideshow = () => {
  container.style.backgroundImage = `url(${images[currentIndex]})`;
  
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    container.style.backgroundImage = `url(${images[currentIndex]})`;
  }, 5000); // Change image every 3 seconds (1s is the fade)
};

// 3. Execution
preloadImages(images)
  .then(() => {
    console.log("All images loaded. Starting...");
    startSlideshow();
  })
  .catch(err => console.error("Failed to load images", err));
