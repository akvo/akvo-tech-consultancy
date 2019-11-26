const axios = require('axios');

axios.get('/api/datapoints/30160001')
    .then(res => {console.log(res.data)});
