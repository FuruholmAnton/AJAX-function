/**
 * AJAX call
 * Works as the normal fetch(),
 * but with some modifications to simplify it's use
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * ex.
 * ajax({
 *  method: 'POST',
 *  body: {
 *   acton: 'subscribe',
 *   userID: 1,
 *  },
 * });
 *
 * @param {Object} options
 * @return {promise} fetch
 */
export default function ajax(options) {
    return new Promise((resolve, reject) => {
        if (!options.method) options.method = 'post';

        /**
         * Set default headers if none where set.
         * Send your own headers-object if you don't want this
         */
        if (!options.headers) {
            options.headers = {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            };
        }
        if (!options.headers['Access-Control-Allow-Origin']) {
            options.headers['Access-Control-Allow-Origin'] = '*';
        }

        /* Needed for cookies to be set */
        if (!options.credentials) {

            if (options.url.startsWith(window.origin) ) {
                options.credentials = 'same-origin';
            } else {
                options.credentials = 'include';
            }
        }

        /* Set url to BIA.AJAX_URL as default */
        let url = options.url || window.location.href;

        if (options.body) {
            /* converts body to: "key=value&key2+value2" */
            const params = typeof options.body == 'object' ? deepSerialize(options.body) : options.body;

            /* Allows the method to be send case-insensitive */
            const method = options.method.toLowerCase();

            if (method === 'post') {
                if (options.body.constructor.name === 'FormData') {
                    // Removes default header and lets the browser decide
                    options.headers = {};
                } else {
                    // Add the serialized string as the body
                    options.body = params;
                }
            } else if (method === 'get') {
                /**
                 * Body is not allowed to be send with a GET method
                 * Instead we add it to the url as string params
                 */
                delete options.body;

                /**
                 * Looks in the url for a query
                 * Adds the new params
                 */
                if (url.includes('?')) {
                    url += url.endsWith('&') || url.endsWith('?') ? '' : '&';
                } else if (params.indexOf('?') !== 0) {
                    url += '?';
                }
                url += params;
            }
        }

        /**
         * The AJAX request, using es6 fetch.
         */
        fetch(url, options).then((response) => {
            const contentType = response.headers.get('content-type');

            /* Function to make the code look cleaner */
            const has = (text) => contentType.indexOf(text) !== -1;

            /* Was the response successful */
            if (response.ok && contentType) {
                /**
                 * Check content types
                 * and handles them accordingly
                 */
                if (has('application/json')) {
                    resolve(response.json());
                } else if (has('text/')) {
                    /* Parses text and html */
                    resolve(response.text());
                } else if (has('form-data')) {
                    resolve(response.formData());
                } else if (has('image/')) {
                    resolve(response.blob());
                } else if (has('audio/') || has('video/') || has('application/ogg')) {
                    resolve(response.arrayBuffer());
                } else {
                    resolve(response);
                }
            } else {
                // reject only print an error in the console
                // We can use resolve instead and handle the error in the function that called ajax
                console.log('ajax response not ok: ', response);
                reject(response);
            }
        }).catch((err) => {
            /* Catch error */
            console.log('ajax catch: ', err);
            reject(err);
        });
    });
}

/**
 * Serializes the object and arrays and objects of the main object.
 *
 * @param {Object} data - the object to serialize
 * @param {String} prefix - used internally to keep track of the nesting
 */
function deepSerialize(data, prefix = '') {
    if (!data || typeof data == 'function') return prefix != '' ? prefix + '=null' : '';
    const array = [];

    if (data instanceof Object) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (typeof value == 'string' || typeof value == 'object') {
                    array.push(deepSerialize(value, prefix !== '' ? prefix + `[${key}]` : key));
                }
            }
        }
        return array.join('&');
    } else if (typeof data == 'string') {
        return prefix + '=' + data;
    }
}
