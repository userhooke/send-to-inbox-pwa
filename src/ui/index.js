console.log(window.location.pathname);

if (location.search) {
  const parsedUrl = new URL(window.location.toString());
  let providedData = '';
  parsedUrl.searchParams.forEach(value => {
    providedData = providedData + value  + '\n'
  })
  console.log(providedData);
}
