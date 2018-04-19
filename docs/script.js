import ajax from '../ajax';

ajax({
    url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-0.3.5&s=fb5abb6d37e3ffef86e8829294ad6d4c&auto=format&fit=crop&w=2250&q=80',
    method: 'get',
    body: {
        test: true,
    }
}).then((output) => {
    const url = URL.createObjectURL(output);
    console.log(output, url);
    document.getElementById('image').src = url;
});