/**
 * Get json response for an endpoint
 * @param {string} url
 * @param {array} params
 * @returns {} json response.
 */
function getEndpointResponse(url, params) {

    const promise = new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        if (params) {
            url = buildUrlParams(url, params);
        }
        request.open('GET', url);
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response); // we got data here, so resolve the Promise
            }
            else {
                if (request.status === 429) {
                    reject(Error('too many requests')); // Too mmany
                }
                reject(Error(request.statusText)); // status is not 200 OK, so reject
            }
        };

        request.onerror = () => {
            reject(Error('Error fetching data.')); // error occurred, reject the  Promise
        };

        request.send(); // send the request
    });

    return promise;

}

/**
 * Returns url with param as string.
 *
 * @param {string} url 
 * @param {object} params 
 */
function buildUrlParams(url, params) {
    let params_array = Object.entries(params);
    let params_string = [];

    params_array.forEach(element => {
        params_string.push(element.join('='));
    });

    url = url + '?' + params_string.join('&');

    return url;
}

    /**
     * @param {data: object}
     */
    function saveToLocalStorage(data, module_name, keep_time = 3600) {
        // Expires after 3600 seconds.
        data['expire_time'] = Math.floor(Date.now() / 1000) + keep_time;

        // Save the data.
        localStorage.setItem(module_name, JSON.stringify(data));
    }

    /**
     * Returns local storage, or null if expired.
     */
    function getFromLocalStorage(module_name) {
        // If the storage is too old, return NULL
        let local_storage = JSON.parse(localStorage.getItem(module_name));
        let now = Math.floor(Date.now() / 1000);

        if (local_storage !== null) {
            // Storage is not expired.
            if (local_storage.expire_time > now) {
                return localStorage.getItem(module_name);
            }
            // Storage has expired.
            localStorage.removeItem(module_name);
        }
        return null;
    }