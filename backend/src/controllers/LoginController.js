const bcrypt = require('bcrypt');
const user = require('../models/User');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
  async store(req, res) {

    try {
      const {email, password} = req.body;

      if(!email || !password) {
        return res.status(200).json({message: "Campo obrigatório faltando!"})
      }
      const user = await User.findOne({email});
      if(!user){
        return res.status(200).json({message: "Usuário não encontrado! Você quer se registrar?"})
      }
      if(user && await bcrypt.compare(password, user.password)){
        const userResponse = {
          _id:user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }

        return jwt.sign({ user: userResponse }, 'secret', (err, token) =>{
          return res.json({
            user: token,
            user_id: userResponse._id
          })
        })
        // return res.json(userResponse)
      }else{
        return res.status(200).json({message: "Email ou Senha estão incorretos!"})
      }

    } catch (error) {
      throw Error(`Erro ao autenticar o Usuário ${error}`)
    }

  }
}