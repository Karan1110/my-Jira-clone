const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Employee = require("../models/employee")
const isadmin = require("../middlewares/isAdmin.js")
const Sequelize = require("sequelize")
const Notification = require("../models/notifications.js")

router.post("/leaves/:id", [auth, isadmin], async (req, res) => {
  const employee = await Employee.findByPk(req.user.id)
  if (!employee) return res.status(404).json({ message: "user not found..." })

  if (employee.manager_id || employee.dataValues.manager_id) {
    await Notification.create({
      message: `${
        employee.name || employee.dataValues.name
      } has taken a leave today`,
    })
  }

  await Employee.update(
    {
      total_working_days: Sequelize.literal("total_working_days - 1"),
    },
    { where: { id: req.params.id } }
  )

  res.status(200).send(employee)
})

router.post("/leaves/add/:id", [auth, isadmin], async (req, res) => {
  const employee = await Employee.update(
    {
      total_working_days: Sequelize.literal("total_working_days + 1"),
    },
    { where: { id: req.params.id } }
  )

  res.status(200).send(employee)
})

module.exports = router
