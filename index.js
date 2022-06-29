if (!process.env.PORT) {
  require('dotenv').config()
}

const express = require('express')
const { connect, model, Schema } = require('mongoose')
const morgan = require('morgan')

connect(process.env.URI, { useNewUrlParser: true }).then(
  console.log('Connected to MongoDB')
)

const Answer = model(
  'answer',
  new Schema({
    name: Schema.Types.String,
    answers: Schema.Types.Array,
    kill: Schema.Types.Boolean,
    previus: {
      type: Schema.Types.ObjectId,
      ref: 'answer'
    }
  })
)

const app = express()

app.use(express.json())
app.use(morgan('dev'))


app.get('/api', async (_, res) => {
  const answer = await Answer.findOne().sort({ field: 'asc', _id: -1 })
  res.json(answer)
})

app.get('/api/:id', async (req, res) => {
  console.log(req.params.id)
  const answer = await Answer.findOne({previus: req.params.id})

  if (!answer) {
    res.status(404).json({
      error: 'Answer not found'
    })
  }
  
  res.json(answer)
})

app.post('/api', async (req, res) => {
  console.log({body: req.body})
  const answer = new Answer(req.body)
  const savedAnswer = await answer.save()
  res.json(savedAnswer)
})

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running')
})
