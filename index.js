//import fetch from 'cross-fetch';
const express =require("express")
const dotenv =require("dotenv")

const fetch= require(`cross-fetch`)
const path =require("path");
//const fetch=require("node-fetch")
const con =require("./config/db")
const app=express();
dotenv.config({ path: './config.env'})
const port=process.env.PORT || 3000
const static_path=path.join(__dirname, "./public");
const template_path=path.join(__dirname, "./templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
//app.set("view engine","hbs");
app.set("view engine","ejs");
app.set("views",template_path);

fetch("https://api.wazirx.com/api/v2/tickers/?_limit=10") // fetch data from api
.then((res)=>res.json())
.then((res)=>convert(res))
.catch((err)=>console.log(err))

app.get("/",function(req,res)
{
    con.query("select * FROM market",function(err,rows,field){
        if(err) throw err
        console.log(rows)
       res.render('main',{records:rows}) // render data into frontend main.ejs and show in table

    })


  
})
//module.exports=myArray;u
let arr2=[];
let check=1;


function convert(res) { // fetch only 10 data from this api 
    let data=JSON.stringify(res)
    let data1=JSON.parse(data)
    let key=Object.values(data1);
    //console.log(value1)
    for(let i=0;i<10;i++)
   {
    let value1=Object.values(key[i])
    let key1=Object.keys(key[i])
    //console.log(value1)
    //console.log(key1)
    let arr4=[];
    for(let j=0;j<key1.length;j++)
    {
        if(key1[j]=='name')
        {
          arr4.push(value1[j]);
       }
       else if(key1[j]=='last')
       {
           arr4.push(value1[j])
       }
       else if(key1[j]=='buy')
       {
           arr4.push(value1[j])
       }
       else if(key1[j]=='sell')
       {
           arr4.push(value1[j])
       }
        else if(key1[j]=='volume')
        {
            arr4.push(value1[j])
        }
        else if(key1[j]=='base_unit')
        {
            arr4.push(value1[j])
        }
    }
    arr2.push(arr4)
    
   }
  //save(arr2); call for store data into mysql
   
}
function save(data) { // function for insert top 10 data into mysql 
    for(let i=0;i<data.length;i++)
    {
       let base_unit=data[i][0];
       let last=data[i][1];
       let volume=data[i][2];
       let sell=data[i][3];
       let buy =data[i][4];
       let name=data[i][5]
       let sql="INSERT INTO market(id,name,last,Buy,Sell,Volume,base_unit) VALUES(?,?,?,?,?,?,?)"
       con.query(sql,[null,name,last,buy,sell,volume,base_unit],(err,result)=>{
           if(err) throw err;
          

       })
    }
    
}

app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})