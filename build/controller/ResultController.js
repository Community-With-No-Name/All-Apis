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
const Results_1 = __importDefault(require("../models/Results"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key = process.env.SECRET_KEY || "secret";
class ResultController {
    static AddResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const { courseId, courseName, score, timeElapsed, timeLeft, date, time } = req.body;
            const newResult = {
                courseId, courseName, score, timeElapsed, timeLeft, date, time, userId: decode === null || decode === void 0 ? void 0 : decode.userId
            };
            decode && (decode === null || decode === void 0 ? void 0 : decode.userId) && (yield Results_1.default.create(newResult).then(() => {
                res.json({ data: newResult, message: "Result Added Successfully" });
            })
                .catch((err) => {
                res.send("error" + err);
            }));
        });
    }
    static GetAllResults(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            decode && (decode === null || decode === void 0 ? void 0 : decode.userId) && (yield Results_1.default.find({ userId: decode === null || decode === void 0 ? void 0 : decode.userId }).then(result => {
                result && res.json({ message: "All Results Retrieved Successfully", data: result, total: result.length });
                !result && res.json({ message: "Unexpected Error" });
            }));
        });
    }
    static GetCourseResults(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            decode && (decode === null || decode === void 0 ? void 0 : decode.userId) && (yield Results_1.default.find({ userId: decode === null || decode === void 0 ? void 0 : decode.userId, courseId }).then(result => {
                result && res.json({ message: `All ${result === null || result === void 0 ? void 0 : result.courseName} retrieved successfully`, data: result, total: result.length });
                !result && res.json({ message: "Unexpected Error" });
            }));
        });
    }
    static GetLatestResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            decode && (decode === null || decode === void 0 ? void 0 : decode.userId) && (yield Results_1.default.findOne({ userId: decode === null || decode === void 0 ? void 0 : decode.userId, courseId }).sort({ created: -1 }).then(result => {
                var _a;
                result && res.json({ message: `${(_a = result[0]) === null || _a === void 0 ? void 0 : _a.courseName} result retrieved successfully`, data: result[0] });
            }));
        });
    }
    static DeleteResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Promise.all(Results_1.default.findOneAndDelete({ userId: decode === null || decode === void 0 ? void 0 : decode.userId, courseId }).then(() => __awaiter(this, void 0, void 0, function* () {
                yield Results_1.default.find().then(result => {
                    result && res.json({ message: "All result Items Retrieved Successfully", data: result });
                    !result && res.json({ message: "Unexpected Error" });
                });
            })));
        });
    }
}
exports.default = ResultController;
