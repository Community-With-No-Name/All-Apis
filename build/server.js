"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
var AuthRouter = require('./routes/auth');
var CoursesRouter = require('./routes/courses');
var QuestionsRouter = require('./routes/questions');
var ResultsRouter = require('./routes/results');
var UserCoursesRouter = require('./routes/userCourses');
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost/TEAM_MANAGEMENT";
const connection = mongoose_1.default.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB database connected successfully'))
    .catch(error => console.error(error));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/team_management/auth', AuthRouter);
app.use('/team_management/courses', CoursesRouter);
app.use('/team_management/questions', QuestionsRouter);
app.use('/team_management/results', ResultsRouter);
app.use('/team_management/userCourses', UserCoursesRouter);
app.get('/', (req, res) => res.send(`Team Management ⚡️[server]: Server is running at https://localhost:${PORT}`));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
