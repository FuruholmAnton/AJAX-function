# AJAX
A simple to use ajax function based on fetch.

```JavaScript
ajax({
    url: 'https://example.com/',
    method: 'POST',
    body: {
        acton: 'subscribe',
        userID: 1,
    },
});
``` 
```JavaScript
ajax('https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-0.3.5&s=fb5abb6d37e3ffef86e8829294ad6d4c&auto=format&fit=crop&w=2250&q=80')
    .then((output) => {
        const url = URL.createObjectURL(output);
        document.getElementById('image').src = url;
    }).catch((err) => {
        console.log(err);
    });
```