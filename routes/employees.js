const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin")
const Skill = require("../models/skills")
const Employee = require("../models/employee")
const Education = require("../models/education")
const Experience = require("../models/experience")
const Ticket = require("../models/ticket")
const Benefit = require("../models/benefits")
const Meeting = require("../models/meeting")
const Notification = require("../models/notifications")
const Performance = require("../models/performance.js")
const Department = require("../models/department")
const winston = require("winston")
const { Sequelize, Op } = require("sequelize")

router.get("/average_salary", [auth, isadmin], async (req, res) => {
  const Users = await Employee.findAll({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("salary")), "average_salary"],
    ],
  })

  // res.status(200).send(Users.dataValues.average_salary);
  res.status(200).send(Users)
})

router.get("/statistics", [auth, isadmin], async (req, res) => {
  const employeeStatistics = {}
  //  employeeStatistics
  // Performance statistics
  employeeStatistics.Employee_Performance_Below_Average =
    await Employee.findAll({
      include: [
        {
          model: Performance,
          as: "Performance",
          where: {
            points: {
              [Op.lte]: 60,
            },
          },
        },
      ],
    })

  if (!Employee_Performance_Below_Average)
    return res.status(400).send("fuck off ")

  employeeStatistics.Employee_Performance_Average = await Employee.findAll({
    include: [
      {
        model: Performance,
        as: "Performance",
        where: {
          points: {
            [Op.lte]: 60,
          },
        },
      },
    ],
  })

  employeeStatistics.Employee_Performance_Above_Average =
    await Employee.findAll({
      include: [
        {
          model: Performance,
          as: "Performance",
          where: {
            points: {
              [Op.lte]: 60,
            },
          },
        },
      ],
    })

  // Department statistics
  employeeStatistics.Department = await Employee.findAll({
    include: [
      {
        model: Department,
        as: "Department",
        where: {
          name: req.body.department,
        },
      },
    ],
  })

  employeeStatistics.Education = await Employee.findAll({
    include: [
      {
        model: Education,
        as: "Education",
        where: {
          field: "something",
        },
      },
    ],
  })

  employeeStatistics.Manager = await Employee.findAll({
    include: [
      {
        model: Employee,
        as: "Manager",
        where: {
          name: "sus",
        },
      },
    ],
  })
  employeeStatistics.MostEmployeeManager = await Employee.findAll({
    attributes: [
      "id,name",
      [
        Sequelize.literal(
          '(SELECT COUNT("Employee"."id") FROM "Employees" AS "Employee")'
        ),
        "manager_count",
      ],
    ],
    include: [
      {
        model: Employee,
        as: "Employee",
      },
    ],
    limit: 5,
    order: [[Sequelize.literal("manager_count"), "DESC"]],
  })

  employeeStatistics.Skill = await Skill.findAll({
    attributes: [
      "name",
      [
        Sequelize.literal(
          '(SELECT COUNT("Employee"."id") FROM "Employees" AS "Employee")'
        ),
        "usage_count",
      ],
    ],
    include: [
      {
        model: Employee,
        as: "Employee",
        // attributes: [],
      },
    ],
    limit: 5,
    order: [[Sequelize.literal("usage_count"), "DESC"]],
  })

  if (!mostUsedSkill) return res.status(400).send("fuck off...")

  console.log(
    `The most used skill is ${mostUsedSkill.name} with ${mostUsedSkill.usage_count} employees having that skill.`
  )

  employeeStatistics.Experience = await Employee.countExperience()
  console.log(employeeStatistics)

  res.status(200).send(employeeStatistics)
})

router.get("/", [auth, isadmin], async (req, res) => {
  const pn = req.query.propertyName
  const pv = req.query.propertyValue

  const Users = await Employee.findAll({
    exclude: ["password"],
    where: {
      [Op.like]: {
        pn: pv,
      },
    },
  })

  res.status(200).send(Users)
})

router.get("/me", [auth, isadmin], async (req, res) => {
  winston.info(req.user.id)
  const me = await Employee.findOne({
    where: {
      id: req.user.id,
    },
    include: [
      {
        model: Employee,
        as: "Manager",
      },
      {
        model: Education,
        as: "Education",
      },
      {
        model: Experience,
        as: "Experience",
      },
      {
        model: Notification,
        as: "Notification",
      },
      {
        model: Ticket,
        as: "Ticket",
      },
      {
        model: Skill,
        as: "Skill",
      },
      {
        model: Benefit,
        as: "Benefit",
      },
      {
        model: Meeting,
        as: "Meeting",
      },
      {
        model: Department,
        as: "Department",
      },
      {
        model: Performance,
        as: "Performance",
      },
    ],
  })

  res.status(200).send(me)
})

router.get("/:id", [auth, isadmin], async (req, res) => {
  const employee = Employee.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Employee,
        as: "Manager",
      },
      {
        model: Education,
        as: "Education",
      },
      {
        model: Experience,
        as: "Experience",
      },
      {
        model: Notification,
        as: "Notification",
      },
      {
        model: Ticket,
        as: "Ticket",
      },
      {
        model: Skill,
        as: "Skills",
      },
      {
        model: Benefit,
        as: "Benefit",
      },
      {
        model: Meeting,
        as: "Meeting",
      },
      {
        model: Department,
        as: "Department",
      },
      {
        model: Performance,
        as: "Performance",
      },
    ],
  })
  res.status(200).send(employee)
})
// performance department employee_id
router.get("/", [auth, isadmin], async (req, res) => {
  const employee = await Employee.findAll({
    order: [["salary", "ASC"]], // Sort by salary in ascending order
    offset: 10, // Skip the first 10 records
    imit: 5,
    include: [
      {
        model: Employee,
        as: "Manager",
      },
      {
        model: Education,
        as: "Education",
      },
      {
        model: Experience,
        as: "Experience",
      },
      {
        model: Notification,
        as: "Notification",
      },
      {
        model: Ticket,
        as: "Ticket",
      },
      {
        model: Skill,
        as: "Skills",
      },
      {
        model: Benefit,
        as: "Benefit",
      },
      {
        model: Meeting,
        as: "Meeting",
      },
      {
        model: Department,
        as: "Department",
      },
      {
        model: Performance,
        as: "Performance",
      },
    ],
  })

  res.status(200).send(employee)
})

router.post("/", async (req, res) => {
  try {
    const userExists = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    })
    if (userExists) return res.status(400).send("user exists already...")
    const salt = await bcrypt.genSalt(10)
    const p = await bcrypt.hash(req.body.password, salt)
    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      password: p,
      salary: req.body.salary,
      age: req.body.age,
      isAdmin: req.body.isadmin,
      department_id: req.body.department_id,
      manager_id: req.body.manager_id,
      education_id: req.body.education_id,
      performance_id: req.body.performance_id,
      total_working_days: req.body.total_working_days,
      total_working_hours: req.body.total_working_hours,
      salary_per_hour: req.body.salary_per_hour,
      last_seen: req.body.last_seen,
      attended_meetings: req.body.attended_meetings,
      total_meetings: req.body.total_meetings,
    })

    const token = employee.generateAuthToken()
    res.status(201).send({ token: token, Employee: employee })
  } catch (ex) {
    console.log(ex, ex.message)
  }
})

router.put("/property", auth, isadmin, async (req, res) => {
  try {
    const userExists = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    })

    const user = await Employee.findByPk(req.user.id)

    if (!user) {
      return res.status(404).send("User Not Found.")
    }

    if (userExists) {
      return res.status(400).send("Email already in use")
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials.")
    }

    const { propertyName } = req.query
    const propertyValue = req.body.propertyValue

    const updatedUser = await Employee.update(
      { propertyName: propertyValue },
      {
        where: {
          id: req.params.id,
        },
      }
    )

    // Generate an authentication token if needed
    const token = user.generateAuthToken()

    res.status(200).send(updatedUser)
  } catch (ex) {
    console.log(ex)
    res.status(500).send("Internal Server Error")
  }
})

router.put("/:id", auth, isadmin, async (req, res) => {
  try {
    const userExists = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    })

    const authenticatedUser = await Employee.findByPk(req.user.id)

    if (!authenticatedUser) {
      return res.status(404).send("User Not Found.")
    }

    if (userExists) {
      return res.status(400).send("Email already in use.")
    }
    console.log("herererererer", authenticatedUser)
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      authenticatedUser.password
    )

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials.")
    }

    const updatedUser = await Employee.update(
      {
        name: req.body.name,
        email: req.body.email,
        salary: req.body.salary,
        age: req.body.age,
        isadmin: req.body.isadmin,
        department_id: req.body.department_id,
        manager_id: req.body.manager_id,
        education_id: req.body.education_id,
        performance_id: req.body.performance_id,
        total_working_days: req.body.total_working_days,
        total_working_hours: req.body.total_working_hours,
        salary_per_hour: req.body.salary_per_hour,
        last_seen: req.body.last_seen,
        attended_meetings: req.body.attended_meetings,
        total_meetings: req.body.total_meetings,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )

    // Consider generating a new authentication token if needed
    const token = authenticatedUser.generateAuthToken()
    console.log(updatedUser, authenticatedUser)
    res.status(200).send({ Employee: updatedUser, token: token })
  } catch (ex) {
    console.log(ex)
    res.status(500).send("Internal Server Error")
  }
})

router.delete("/:id", auth, async (req, res) => {
  const employee = await Employee.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send({ Deleted: employee })
})

module.exports = router
