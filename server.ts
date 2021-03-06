import express from "express"
import path from "path"
import cors from "cors"
import mongoose from "mongoose"
const app = express();
var AuthRouter = require('./routes/auth')
var CoursesRouter = require('./routes/courses')
var QuestionsRouter = require('./routes/questions')
var ResultsRouter = require('./routes/results')
var UserCoursesRouter = require('./routes/userCourses')
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost/TEAM_MANAGEMENT"
 const connection = mongoose.connect(mongoURI,
  {
    useNewUrlParser: true,
  useCreateIndex:true,
   useUnifiedTopology:true,
   useFindAndModify: false
 })
 .then(()=>console.log('MongoDB database connected successfully'))
 .catch(error=>console.error(error))

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/team_management/auth', AuthRouter);
app.use('/team_management/courses', CoursesRouter);
app.use('/team_management/questions', QuestionsRouter);
app.use('/team_management/results', ResultsRouter);
app.use('/team_management/userCourses', UserCoursesRouter);
app.get('/', (req, res) => res.send(`Team Management ⚡️[server]: Server is running at https://localhost:${PORT}`));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});