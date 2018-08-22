const breadcrumb = ((path = window.location.pathname) => {

  const home = 'CJ Boyd';
  let arr = path.split("/");
  arr[0] = home;
  arr = arr.filter(x => x);

  return ((arr) => {
    const upper = (text) => text.replace(/^\w/, c => c.toUpperCase());
    const html_arr = arr.map((x, i, arr) => {
      const link_text = upper(x);
      const link_url = i === 0 ? "/" : arr.slice(1, i + 1).join("/");
      return i === arr.length - 1 ? link_text : `<a href = "${link_url}">${link_text}</a>`;
    });
    return html_arr.join(" / ");
  })(arr);

})();

$(() => $('#breadcrumb').html(breadcrumb));
