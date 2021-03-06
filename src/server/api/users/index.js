import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../../models/Users'
import hasRole from '../middlewares/hasRole'
import Log from '../../utils/LogService'

const router = Router()

//lista todos os usuários da rota 'api/users/'
router.get('/', hasRole('csti'), (req, res) => {
  User.find({}).then(users => {
    res.send(users)
  })
})

//Atualiza os dados de um usuário na rota 'api/users/'
router.patch('/', (req, res) => {
  User.update(
    { _id: req.user.id },
    {
      $set: req.body
    }
  ).then(user => {
    res.send(user)
  })
})

//Lista os dados do usuário relativo ao token. Rota 'api/users/me'
router.get('/me', (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      res.send(err)
    })
})

//Atualiza os dados do usuário relativo ao token. Rota 'api/users/me'
router.patch('/me', (req, res) => {
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const { password, ...objSemSenha } = req.body
      User.update(
        { _id: req.user.id },
        {
          $set: { ...objSemSenha, password: hash }
        }
      ).then(user => {
        res.send(user)
      })
    })
  } else {
    User.update(
      { _id: req.user.id },
      {
        $set: req.body
      }
    ).then(user => {
      res.send(user)
    })
  }
})

//Cria um usuário. Rota 'api/users/'
router.post('/', hasRole('csti'), (req, res) => {
  const { name, email, password, roles } = req.body
  if (!name) {
    res.status(400).json({
      code: 'MISSING_FIELD_NAME',
      result: {}
    })
  } else if (!email) {
    res.status(400).json({
      code: 'MISSING_FIELD_EMAIL',
      result: {}
    })
  } else if (!password) {
    res.status(400).json({
      code: 'MISSING_FIELD_PASSWORD',
      result: {}
    })
  } else {
    bcrypt.hash(password, 10).then(hash => {
      const newUser = new User({ name, email, roles, password: hash })
      User.findOne({ email }).then(result => {
        if (!result) {
          newUser.save().then(user => {
            Log(
              'USUARIO',
              user.name + ' registrado.',
              req.user.name,
              'rgb(0, 192, 239)'
            )
            res.send({
              id: user._id,
              name: user.name,
              email: user.email,
              roles: user.roles,
              join_date: user.joined
            })
          })
        } else {
          res.status(400).json({
            code: 'EMAIL_IN_USE',
            result: {}
          })
        }
      })
    })
  }
})

router.delete('/', hasRole('csti'), (req, res) => {
  const { id } = req.body
  User.deleteOne({ _id: id })
    .then(result => {
      Log(
        'USUARIO',
        user.name + ' removido.',
        req.user.name,
        'rgb(0, 192, 239)'
      )
      res.send(result)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id', hasRole('csti'), (req, res) => {
  User.find({ _id: req.params.id }).then(users => {
    res.send(users[0])
  })
})

router.patch('/:id', hasRole('csti'), (req, res) => {
  User.update(
    { _id: req.params.id },
    {
      $set: req.body
    }
  ).then(user => {
    res.send(user)
  })
})

export default router
