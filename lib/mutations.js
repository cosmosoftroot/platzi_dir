'use strict';
const { ObjectID } = require('mongodb');
const connectDB = require('./db');
const errorHandler = require('./errorHandler');

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: '',
      topic: '',
    };

    const newCourse = Object.assign(defaults, input);
    let db;
    let course;
    try {
      db = await connectDB();
      course = await db.collection('courses').insertOne(newCourse);
      newCourse._id = course.insertedId;
    } catch (err) {
      errorHandler(err);
    }
    return newCourse;
  },

  createStudent: async (root, { input }) => {
    let db;
    let student;
    try {
      db = await connectDB();
      student = await db.collection('students').insertOne(input);
      input._id = student.insertedId;
    } catch (err) {
      errorHandler(err);
    }
    return input;
  },

  editCourse: async (root, { _id, input }) => {
    let db;
    let course;

    try {
      db = await connectDB();
      await db
        .collection('courses')
        .updateOne({ _id: ObjectID(_id) }, { $set: input });
      course = await db.collection('courses').findOne({ _id: ObjectID(_id) });
    } catch (err) {
      errorHandler(err);
    }
    return course;
  },
  editStudent: async (root, { _id, input }) => {
    let db;
    let student;

    try {
      db = await connectDB();
      await db
        .collection('students')
        .updateOne({ _id: ObjectID(_id) }, { $set: input });
      student = await db.collection('students').findOne({ _id: ObjectID(_id) });
    } catch (err) {
      errorHandler(err);
    }
    return student;
  },
  deleteCourse: async (root, { _id }) => {
    let db;
    let course;
    try {
      db = await connectDB();
      course = await db.collection('courses').findOne({ _id: ObjectID(_id) });
      await db.collection('courses').deleteOne({ _id: ObjectID(_id) });
    } catch (err) {
      errorHandler(err);
    }
    return course;
  },

  deleteStudent: async (root, { _id }) => {
    let db;
    let student;
    try {
      db = await connectDB();
      student = await db.collection('students').findOne({ _id: ObjectID(_id) });
      await db.collection('students').deleteOne({ _id: ObjectID(_id) });
    } catch (err) {
      errorHandler(err);
    }
    return student;
  },
  addPeople: async (root, { courseID, personID }) => {
    let course, person, db;
    try {
      db = await connectDB();
      course = await db
        .collection('courses')
        .findOne({ _id: ObjectID(courseID) });
      person = await db
        .collection('students')
        .findOne({ _id: ObjectID(personID) });

      if (!course || !person)
        throw new Error('The person or course does not exist');

      db.collection('courses').updateOne(
        { _id: ObjectID(courseID) },
        { $addToSet: { people: ObjectID(personID) } }
      );
    } catch (err) {
      errorHandler(err);
    }
    return course;
  },
};
