"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserCourses_1 = __importDefault(require("../models/UserCourses"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key = process.env.SECRET_KEY || "secret";
class UserCourseController {
    static AddCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const { courseId, courseName } = req.body;
            console.log(courseId, courseName);
            const courses = yield UserCourses_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId });
            const coursesToCheck = courses === null || courses === void 0 ? void 0 : courses.courses;
            const checkCourses = coursesToCheck === null || coursesToCheck === void 0 ? void 0 : coursesToCheck.filter(i => i.courseName === courseName).length;
            console.log(checkCourses);
            if (checkCourses)
                res.json({ error: `${courseName} already exists` });
            if (!checkCourses) {
                const course = yield UserCourses_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId });
                if (!course) {
                    UserCourses_1.default.create({
                        userId: decode === null || decode === void 0 ? void 0 : decode.userId,
                        courses: [{ courseId, courseName }]
                    });
                    res.json({ message: "Course reg successful" });
                }
                if (course) {
                    const allCourses = course === null || course === void 0 ? void 0 : course.courses;
                    const update = {
                        userId: decode === null || decode === void 0 ? void 0 : decode.userId,
                        modified: Date.now(),
                        courses: [
                            ...allCourses,
                            { courseId, courseName }
                        ]
                    };
                    yield UserCourses_1.default.findOneAndUpdate({ userId: decode === null || decode === void 0 ? void 0 : decode.userId }, {
                        $set: update
                    }, {
                        new: true,
                        runValidators: true,
                        upsert: true,
                        returnOriginal: false,
                        returnNewDocument: true
                    }).exec().then(() => res.json({ message: "Course Added Successfully" }));
                }
                // .catch((err) => {
                //   res.send("error" + err);
                // })
            }
        });
    }
    static GetAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield UserCourses_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId }).then(courses => {
                courses && res.json({ message: "All User courses Retrieved Successfully", data: courses, total: courses.length });
                !courses && res.json({ message: "Unexpected Error" });
            });
        });
    }
    static GetCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield UserCourses_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId }).then(course => {
                course && res.json({ message: "course Retrieved Successfully", data: course });
                !course && res.json({ message: `No registered course found for ${decode === null || decode === void 0 ? void 0 : decode.fullName}` });
            });
        });
    }
    static DeleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Promise.all(UserCourses_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId, courses: {
                    courseId
                } }).then((course) => __awaiter(this, void 0, void 0, function* () {
                var updatedCourse = course === null || course === void 0 ? void 0 : course.courses.filter(course => course.courseId !== courseId);
                const update = {
                    userId: decode === null || decode === void 0 ? void 0 : decode.userId,
                    courses: [
                        ...updatedCourse
                    ]
                };
                yield UserCourses_1.default.findOneAndUpdate({ userId: decode === null || decode === void 0 ? void 0 : decode.userId }, {
                    $set: update
                }, {
                    new: true,
                    runValidators: true,
                    upsert: true,
                    returnOriginal: false,
                    returnNewDocument: true
                }).exec();
            })));
        });
    }
}
exports.default = UserCourseController;
