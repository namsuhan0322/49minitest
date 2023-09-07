const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm');
const jwt = require('jsonwebtoken');
const { async } = require('regenerator-runtime');
const { addYears } = require('date-fns');
const status = require('statuses');
const { id } = require('date-fns/locale');

const myDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '4488',
  database: 'westagram'
}) ;

myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
 })

const app = express()

app.use(express.json()) 

app.get('/signUp',async(req, res)=> {
  try {
      const userData = await myDataSource.query(`SELECT id, name, email FROM 49test`)

    console.log("USER DATA :", userData)

    return res.status(200).json({
      "49test": userData
    })
  } catch (error) {
    console.log(error)
  }
})

app.post("/signUp", async(req, res)=> {
  try {
    const me = req.body

    const { name, password, email } = me 

    if (!email || !name || !password) {
      const error = new Error("키_오류")
      error.statusCode = 400
      throw error
    }


    if (password.length <8) {
      const error = new Error("비밀번호가 짧습니다")
      error.statusCode = 400
      throw error 
    } ;

    const existingUser = await myDataSource.query(`
      SELECT email FROM 49test WHERE email = ?`,email)

    if (existingUser.length) {
      const error = new Error("같은 이메일")
      error.statusCode = 400
      throw error
    } ;

    const userData = await myDataSource.query(`
    INSERT INTO 49test (
      name, 
      password,
      email
    )
    VALUES (
      '${name}',
      '${password}', 
      '${email}'  
    )
  `);

  console.log('iserted user id', userData.insertId)

  return res.status(200).json({
    "message": "userCreated"
  })
    
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode).json({
      "message": error.message
    })
  }
})

app.post("/login", async(req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const token = jwt.sign({id: id }, 'wecode')
    console.log(req.body);
  
    if (!email || !password ) {
      const error = new Error("키_에러")
      error.statusCode = 400
      throw error
    };

    const alreadyEmail = await myDataSource.query(`SELECT id, email FROM 49test WHERE 1=1 and email = "${email}" and password = "${password}"`)


    if (!alreadyEmail.length){
      const error = new Error("이메일 혹은 비밀번호 틀림")
      error.statusCode = 400
      throw error
    }

       if (alreadyEmail.length) {
        return res.status(200).json({ 
          "message" : "로그인 성공",
          "accessToken" : token
        })
      } ;
    
  } catch (error) {
    console.log(error)
  }
  
})

const server = http.createServer(app) 

const start = async () => { 
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

start()