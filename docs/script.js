import ajax from '../ajax';

ajax({
    url: 'https://www.cats.org.uk/uploads/images/featurebox_sidebar_kids/grief-and-loss.jpg',
    method: 'get',
    body: {
        test: true,
    }
}).then((output) => {
    console.log(output);
    
})
