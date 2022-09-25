const express = require('express');
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


// Mongoose work
mongoose.connect('mongodb://localhost:27017/todolistDB')

const itemsSchema = mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemsSchema);

const buyFood = new Item({
    name: "Buy Food"
})
const cookFood = new Item({
    name: "Cook Food"
})
const eatFood = new Item({
    name: "Eat Food"
})

const defaultItems = [buyFood, cookFood, eatFood];


const ListSchema = {
    name: String,
    item: [itemsSchema]
}

const List = mongoose.model('list', ListSchema);


app.get('/', (req, res) =>{
    const day = date.getDate();

    const itemList = Item.find( (err, listitems) =>{

            if(listitems.length === 0){
                Item.insertMany(defaultItems);
                res.redirect('/')
            }

            res.render('list.ejs', {listTitle: day, newListItems: listitems});
    })
    
})

app.post('/', (req, res)=>{

    const itemName = req.body.newItem;

    const newItem = new Item({
        name: itemName
    });

    newItem.save();

    res.redirect('/')

})

app.post('/delete', (req, res)=>{
    console.log(req.body.itemDone);

    Item.findByIdAndRemove(req.body.itemDone, (err)=>{if(err){console.log(err)} else { console.log('Successfully deleted')}})
    res.redirect('/')
});


// app.get('/:todo', (req, res)=>{
//     const listName = req.params.todo;

//     List.findOne({name: listName}, (err, gotname)=>{
//         console.log(gotname);
//     })
    
//     const list = new List({
//         name: listName,
//         item: defaultItems
//     })
//     // list.save();
// });

app.listen(3000, ()=>{console.log('The server is working on localhost:3000')})
