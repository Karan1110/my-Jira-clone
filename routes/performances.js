const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Performance = require("../models/performance.js")
const User = require("../models/user.js")

router.get("/:id", async (req, res) => {
  const performance = await Performance.findByPk(req.params.id)
  if (!performance) return res.status(400).send("not found..")
  res.send(performance)
})

router.get("/leaderboard", async (req, res) => {
  try {
    const performances = await Performance.find({
      sort: [["points", "DESC"]],
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    })
    res.json(performances)
  } catch (ex) {
    res.send(ex.message)
    console.log("ERROR : ")
    console.log(ex)
  }
})

router.post("/", async (req, res) => {
  if (req.body.points > 5) {
    return res.status(400).send("points cant be more than 5 when starting")
  }
  const user = await User.findByPk(req.body.user_id)
  if (!user || user?.performance_id != null) {
    return res.status(400).send("User's performance record already exists...")
  }

  const performance = await Performance.create({
    status: req.body.status,
    points: req.body.points,
    user_id: req.body.user_id,
  })

  res.status(200).send(performance)
})

router.put("/:id", auth, async (req, res) => {
  const performance = await Performance.update(
    {
      status: req.body.status,
      points: req.body.points,
    },
    {
      where: {
        id: req.body.user_id,
      },
    }
  )
  res.status(200).send(performance)
})

module.exports = router
