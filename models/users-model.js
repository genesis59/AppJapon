const { DAO } = require('./dao');

const userDAO = new DAO('users');


// Insertion d'un user dans la BD
userDAO.insertUser = async (data) => {
    const sql = 'INSERT INTO users SET ?';
    const result = await userDAO.query(sql, [data]);
    return result[0];
};


module.exports = userDAO;