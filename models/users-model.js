const { DAO } = require('./dao');

const userDAO = new DAO('users');


// Insertion d'un user dans la BD
userDAO.insertUser = async (data) => {
    const sql = 'INSERT INTO users SET ?';
    const result = await userDAO.query(sql, [data]);
    return result[0];
};

// Récupération données user
userDAO.findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const result = await userDAO.query(sql, [email]);
    return result[0][0];
};

// récupération des email de la BD

userDAO.checkEmail = async (email) => {
    const sql = 'SELECT email FROM users WHERE email = ?';
    const result = await userDAO.query(sql, [email]);
    return result[0][0];
};

module.exports = userDAO;