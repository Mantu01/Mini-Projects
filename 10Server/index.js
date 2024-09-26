const express = require('express');
let users = require('./MOCK_DATA.json');
const fs = require('fs');

const PORT=8000;

const app=express();

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=> res.send("Welcome to home page"))
app.get("/users",(req,res)=>{
  const html=`
    <h1>All Users :</h1>
    <ul>
      ${users.map((user)=>`<li>${user.first_name}<\li>`).join("")}
    </ul>
  `
  return res.send(html);
});

app.route("/api/users")
  .get((req,res)=>res.send(users))
  .post((req,res)=>{
    const body=req.body;
    users.push({id:users.length+1, ...body});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),()=>res.json({status:"sucess", id:users.length}));
  })

app.route("/api/users/:id")
  .get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find(((user)=>user.id===id));
    return res.json(user);
  })
  .patch((req,res)=>{
    const id=Number(req.params.id);
    const body=req.body;
    const idx=users.findIndex((user)=>user.id===id);
    users[idx]={...users[idx], ...body}
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),()=>res.json({status:"sucess", id:id}));
  })
  .delete((req,res)=>{
    const id=Number(req.params.id);
    users=users.filter((user)=>user.id!==id);
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),()=>res.json({status:"sucess", id:id}));
  });

app.listen(PORT,()=>console.log(`Server started at Port : ${PORT}`));
