const mongoose=require('mongoose')
mongoose.connect((process.env.MONGODB_URL),{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error) => {
    if(!error){
        console.log('Connected successfully!')
    }
    else{
        console.log('connection error: '+error)
    }
})

//Useremail: sheikh@gmail.com //password: 8bb958b9
