const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
  async store(req, res){
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

        return res.json(user)

      }
      
      return res.status(400).json({
        message: 'email já cadastrado ! Deseja logar ao invés de cadastrar?'
      })


    } catch (error) {
      throw Error(`Erro durante o registro do novo usuário: ${error}`)
    }
  }
}