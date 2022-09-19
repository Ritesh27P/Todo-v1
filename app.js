const express = require('express');
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

let items = [];
let work_items = []

app.get('/', (req, res) =>{
    const day = date.getDate();
    
    res.render('list.ejs', {listTitle: day, newListItems: items, list_no: items.length})
})

app.post('/', (req, res)=>{

    const item = req.body.newItem;

    if(req.body.list === 'Work List'){
        work_items.push(item)
        res.redirect('/work')
    } else {
        item.push(item);
        res.redirect('/')
    }

})

app.get('/work', (req, res)=>{

    res.render("list", {listTitle: 'Work List', newListItems: work_items, list_no: work_items.length})
})

app.post('/work', (req, res)=>{
    const item = req.body.newItem;
    work_items.push(item);

    res.redirect('/work')
})


app.listen(3000, ()=>{console.log('The server is working on localhost:3000')})
