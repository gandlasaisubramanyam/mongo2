// Design database for Zen class programme
// users
// codekata
// attendance
// topics
// tasks
// company_drives
// mentors

// Find all the topics and tasks which are thought in the month of October
// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
// Find all the company drives and students who are appeared for the placement.
// Find the number of problems solved by the user in codekata
// Find all the mentors with who has the mentee's count more than 15
// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

// 1.To create Database
// use day2

// 2.To create and insert data for user
db.user.insertMany([
  {
    user_id: 1,
    name: "Boobalan",
    email: "Boobalan@gmail.com",
  },
  {
    user_id: 2,
    name: "gopi",
    email: "gopi@gmail.com",
  },
  {
    user_id: 3,
    name: "arun",
    email: "arun@gmail.com",
  },
]);

// 2.To create and insert data for codekata

db.codekata.insertMany([
  {
    user_id: 1,
    codekata_title: "Array",
    codekata_problems: 5,
  },
  {
    user_id: 2,
    codekata_title: "Strings",
    codekata_problems: 10,
  },
  {
    user_id: 3,
    codekata_title: "Maths",
    codekata_problems: 15,
  },
]);

// 3.To create and insert data for attendance

db.attendance.insertMany([
  {
    user_id: 1,
    topic_id: 1,
    present: true,
  },

  {
    user_id: 2,
    topic_id: 2,
    present: true,
  },
  {
    user_id: 3,
    topic_id: 3,
    present: false,
  },
]);

// 4.To create and insert data for topics

db.topics.insertMany([
  {
    topic_id: 1,
    topic: "React",
    topic_created: new Date("2020-10-10"),
  },
  {
    topic_id: 2,
    topic: "MongoDB",
    topic_created: new Date("2020-10-25"),
  },
  {
    topic_id: 3,
    topic: "Nodejs",
    topic_created: new Date("2020-11-05"),
  },
]);

// 5.To create and insert data for task

db.tasks.insertMany([
  {
    topic_id: 1,
    topic: "HTML",
    topic_date: new Date("2020-10-01"),
    submitted: true,
  },
  {
    topic_id: 2,
    topic: "CSS",
    topic_date: new Date("2020-10-10"),
    submitted: true,
  },
  {
    topic_id: 3,
    topic: "Javascript",
    topic_date: new Date("2020-10-16"),
    submitted: false,
  },
]);

// 6.To create and insert data for mentor

db.mentors.insertMany([
  {
    mentor_id: 1,
    mentor_name: "Mohan",
    mentor_email: "mohan@gmail.com",
    class_count: 20,
  },
  {
    mentor_id: 2,
    mentor_name: "Akbar",
    mentor_email: "akbar@gmail.com",
    class_count: 10,
  },
  {
    mentor_id: 3,
    mentor_name: "Ragavkumar",
    mentor_email: "ragav@gmail.com",
    class_count: 50,
  },
]);

// 7.To create and insert data for companydrive

db.companydrives.insertMany([
  {
    user_id: 1,
    drive_date: new Date("2020-10-18"),
    company_name: "Amazon",
  },
  {
    user_id: 2,
    drive_date: new Date("2020-10-25"),
    company_name: "Zoho",
  },
  {
    user_id: 3,
    drive_date: new Date("2020-10-30"),
    company_name: "Google",
  },
]);

// 1.Find all the topics and tasks which are thought in the month of October
db.tasks
  .find({
    $and: [
      { topic_date: { $lte: new Date("2020-10-31") } },
      { topic_date: { $gte: new Date("2020-10-15") } },
    ],
  })
  .pretty();

db.topics
  .find({
    $and: [
      { topic_created: { $lte: new Date("2020-10-31") } },
      { topic_created: { $gte: new Date("2020-10-15") } },
    ],
  })
  .pretty();

// 2.Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.companydrives
  .find({
    $and: [
      { drive_date: { $lte: new Date("2020-10-31") } },
      { drive_date: { $gte: new Date("2020-10-15") } },
    ],
  })
  .pretty();

// 3.Find all the company drives and students who are appeared for the placement.
db.companydrives.aggregate({
  $lookup: {
    from: "user",
    localField: "user_id",
    foreignField: "user_id",
    as: "company_drives",
    pipeline: [{ $project: { name: 1 } }],
  },
});

// 4.Find the number of problems solved by the user in codekata
db.user.aggregate({
  $lookup: {
    from: "codekata",
    localField: "user_id",
    foreignField: "user_id",
    as: "Solved",
    pipeline: [{ $project: { codekata_problems: 1 } }],
  },
});

// 5.Find all the mentors with who has the mentee's count more than 15
db.mentors.find({ class_count: { $gt: 15 } });

// 6.Find the number of users who are absent and task is not submitted between 15 oct-2020 and 31-oct-2020(from and foreignField as same db collection )
db.tasks
  .aggregate([
    {
      $lookup: {
        from: "attendance",
        localField: "topic_id",
        foreignField: "user_id",
        as: "attendance",
      },
    },
    {
      $match: { $and: [{ submitted: false }, { "attendance.present": false }] },
    },
  ])
  .pretty();
