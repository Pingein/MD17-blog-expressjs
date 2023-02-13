import express, { application } from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import { readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import mysql from 'mysql2'
import { resourceLimits } from "worker_threads";
import { useParams } from "react-router-dom";


type BlogData = {
  id?: number
  image_url?: string
  title?: string
  excerpt?: string
  content?: string
  comments?: Comment[]
}

type Comment = {
  id?: number
  commentator_image_url: string
  commentator_name: string
  comment: string
}

const PORT = 3000
const app = express();
const pathToDB = './db/db.json'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'my_db'
})
connection.connect()

// CREATE TABLE blogPosts(id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',image_url VARCHAR(255),title VARCHAR(45),excerpt VARCHAR(200),content VARCHAR(700));
// /* 2023-02-12 23:10:18 [98 ms] */ 
// CREATE TABLE blogComments(  
//     id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
//     commentator_image_url VARCHAR(255),
//     commentator_name VARCHAR(25),
//     comment VARCHAR(140),
//     blog_id int
// );


app.use(bodyparser.json());
app.use(cors({ origin: "*" }));
app.use('/static', express.static('public'))

//connection.query(`CREATE DATABASE my_db DEFAULT CHARACTER SET = 'utf8mb4'`)

const updateBlogDB = (DBpath:string, data:BlogData) => {
  const DB = JSON.parse(readFileSync(DBpath, 'utf-8'))
  DB.blogs.push(data)
  writeFileSync(DBpath, JSON.stringify(DB))
}


app.get("/", (req: Request, res: Response) => {
  res.send("Application works!");
});


app.get('/blogs', (req:Request, res:Response) => {
  connection.query(
    'SELECT * FROM blogPosts',
    function(err, results, fields) {
      res.send(results); // results contains rows returned by server
      //console.log(fields); // fields contains extra meta data about results, if available
    }
  );
})


app.get('/blogs/:id', (req:Request, res:Response) => {
  const id = req.params.id

  let blogData:BlogData = {}

  // connection.query(
  //   `SELECT * FROM blogPosts where id= '${id}' LIMIT 1`,
  //   function(err, results, fields) {
  //     console.log(results[0])
  //     blogData = {...results[0]};    
  //   }
  // );

  connection.query(
    `SELECT *
    FROM blogPosts
    INNER JOIN blogComments
    ON blogPosts.id = blogComments.blog_id
    WHERE blogPosts.id = ${id}`,
    function(err, results, fields) {
      console.log(results)
      res.send(results)
      // let comments:Comment[] = results as Comment[]
      // blogData = {...blogData, comments};    

    }
  );

  //res.send(blogData)
})


app.post('/blogs', (req: Request, res: Response) => {
  const blogPost:BlogData = req.body
  if (blogPost.title.length > 45) {
    throw new Error('title must be less than 45 characters')
  }
  if (blogPost.excerpt.length > 200) {
    throw new Error('excerpt must be less than 200 characters')
  }
  if (blogPost.content.length > 700) {
    throw new Error('content must be less than 700 characters')
  }
  if (!blogPost.image_url) {
    throw new Error('must contain image')
  }
  connection.query(
    `INSERT INTO blogPosts (image_url, title, excerpt, content)
    VALUES ("${blogPost.image_url}", "${blogPost.title}", "${blogPost.excerpt}", "${blogPost.content}");`
    )
})



app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}!`);
});
