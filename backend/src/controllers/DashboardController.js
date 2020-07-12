const Event = require('../models/Event');
const jwt = require('jsonwebtoken');


module.exports = {

  async getEventById(req, res) {
    jwt.verify(req.token, 'secret', async (err, authData) => {
      if (err) {
        res.sendStatus(401); 
      } else {
        const { eventId } = req.params;
        try {
          const events = await Event.findById(eventId)

          if (events) {
            return res.json({ authData, event: events })
          }
        } catch (error) {
          return res.status(400).json({ message: 'Evento não existe!' })
        }
      }

    })
  },

  getAllEvents(req, res) {
    jwt.verify(req.token, 'secret', async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { sport } = req.params;
        const query = sport ? { sport } : {}
        try {
          const events = await Event.find(query)

          if (events) {
            return res.json({ authData, events })
          }
        } catch (error) {
          return res.status(400).json({ message: 'Ainda não tem nenhum evento!' })
        }
      }
    })

  },

  getEventsByUserId(req, res) {
    jwt.verify(req.token, 'secret', async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { user_id } = req.headers;
        
        try {
          const events = await Event.find({ user: authData.user._id })

          if (events) {
            return res.json({ authData, events })
          }
        } catch (error) {
          return res.status(400).json({ message: `Não existem eventos para o usuário ${user_id}!` })
        }
      }
    })
  }
}