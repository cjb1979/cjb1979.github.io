const breadcrumb = (() => {

  let path = window.location.pathname;
  const home = '🏠';
  let arr = path.split("/");
  arr[0] = home;
  arr = arr.filter(x => x);

  const breadcrumb = (arr) => {

    let html_arr = arr.map((x, i) => {
      let link_text, link_url, str;
      if (x === home) {
        link_text = x;
        link_url = "/";
      } else {
        link_text = x;
        link_url = x;
      }

      return i === arr.length - 1 ? link_text : `<a href = "${link_url}">${link_text}</a>`;
    });

    let str = html_arr.join(" > ");

    return str;
  }
  return breadcrumb(arr);
})();

$('#breadcrumb').html(breadcrumb);
