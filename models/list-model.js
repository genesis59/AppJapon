const { DAO } = require('./dao');

const listDAO = new DAO('list_kanji');

listDAO.findListByIdUser = async id => {
    const rows = await listDAO.query('SELECT * FROM list_kanji WHERE id_user=?', [id]);
    return rows[0];
}

module.exports = listDAO;