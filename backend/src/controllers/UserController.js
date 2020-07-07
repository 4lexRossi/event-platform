const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
  async createUser(req, res){
    try {      
      const { firstName, lastName, password, email } = req.body;

      const existentUser = await User.findOne({email});
      if(!existentUser){
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword
 
        });

        return res.json({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })

      }
      
      return res.status(400).json({
        message: 'email já cadastrado ! Deseja logar ao invés de cadastrar?'
      })


    } catch (error) {
      throw Error(`Erro ao registrar do novo usuário: ${error}`)
    }
  },

  async getUserById(req, res){
    const { userId } = req.params;
      try {
        const user = await User.findById(userId);
          if (user){
            return res.json(user)
          }
      } catch (error) {
          return res.status(400).json({
            message:
              'Id de Usuário não existe, deseja se registrar ao invés de logar?'
          })
      }
  }
}