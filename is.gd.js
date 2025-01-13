const shortenWithIsGd = async (longUrl) => {
  const apiUrl = 'https://is.gd/create.php';
  const queryParams = `?format=simple&url=${encodeURIComponent(longUrl.replace("http://localhost:8080/","https://nopaste.boris.sh/"))}`;

  try {
    const response = await fetch(apiUrl + queryParams);

    if (response.ok) {
      const shortUrl = await response.text();
      showCopyBar(shortUrl);
    } else {
      let errorMessage = 'Error shortening URL.';

      // Specific error handling based on is.gd API documentation
      if (response.status === 400) {
        errorMessage = 'Error: Invalid long URL provided.';
      } else if (response.status === 406) {
        errorMessage = 'Error: Problem with the provided short URL (if custom).';
      } else if (response.status === 502) {
        errorMessage = 'Error: Rate limit exceeded. Please try again later.';
      } else if (response.status === 503) {
        errorMessage = 'Error: Service unavailable. Please try again later.';
      }

      // Fallback to error codes if no specific status code match
      if (errorMessage === 'Error shortening URL.') {
          const errorText = await response.text();
          if (errorText.startsWith('Error: ')) {
              if (errorText.includes('Error: 1')) {
                  errorMessage = 'Error: Invalid long URL provided.';
              } else if (errorText.includes('Error: 2')) {
                  errorMessage = 'Error: Problem with the provided short URL (if custom).';
              } else if (errorText.includes('Error: 3')) {
                  errorMessage = 'Error: Rate limit exceeded. Please try again later.';
              } else if (errorText.includes('Error: 4')) {
                  errorMessage = 'Error: Service unavailable. Please try again later.';
              }
          }
      }

      alert(errorMessage);
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
    alert('Error shortening URL. Please check the console for details.');
  }
};
