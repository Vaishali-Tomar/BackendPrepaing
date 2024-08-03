const fs = require("fs");

const fileName = "users.json";
const users = [
    {
        id: 1,
        name: "john", 
        age: 14
    },
    {
        id: 2,
        name: "abd", 
        age: 12
    },
    {
        id: 1,
        name: "abhi", 
        age: 15
    },
]

const writeFileDemo = (filePath, content) => {
    fs.writeFile(filePath, content, (err) => {
        if(err){
            console.log("err", err);
            return;
        }else{
            console.log("succfully file");
        }
    
    })
}

const newUser = [
    {
        id: 5, 
        name: "vaish",
        email: "vaish@gmail.com"
    }
]

const readFileDemo = (filePath)=>{
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log("File Data :", data.toString());
        const userData = JSON.parse(data.toString())
        userData.push(newUser);
        console.log(userData);

        writeFileDemo(fileName, JSON.stringify(userData));
    })
}

readFileDemo(fileName);

const appendFileDemo = (filePath, content) => {
    fs.appendFile(filePath, "\n" + content, (err) => {
        if(err) {
            console.log("err", err);
            return;
        }else{
            console.log("append succesfully");
        }
    })
}
//appendFileDemo();
//writeFileDemo(fileName, JSON.stringify(users));