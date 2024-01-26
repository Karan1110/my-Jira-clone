const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const User = require("../models/user")
const Experience = require("../models/experience")
const moment = require("moment")

router.post("/", [auth], async (req, res) => {
  const start_date = moment(req.body.from).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  const s = new Date(start_date)
  const end_date = moment(req.body.to).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  const t = new Date(end_date)
  console.log(s, t)
  const experience = await Experience.create({
    company: req.body.company,
    from: s,
    to: t,
    user_id: req.body.user_id,
  })

  res.status(200).send(experience)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const start_date = moment(req.body.from).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  const s = new Date(start_date)
  const end_date = moment(req.body.to).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  const t = new Date(end_date)

  const experience = await Experience.update(
    {
      company: req.body.company,
      from: s,
      to: t,
      user_id: req.body.user_id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )

  res.status(200).send(experience)
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  const experience = await Experience.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send({ message: "Deleted successfully", deleted: experience })
})

module.exports = router
