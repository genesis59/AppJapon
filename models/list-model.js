const { DAO } = require('./dao');

const listDAO = new DAO('list_kanji');

// recherche des listes d'un utilisateur
listDAO.findListByIdUser = async id => {
    const rows = await listDAO.query('SELECT * FROM list_kanji WHERE id_user=?', [id]);
    return rows[0];
};

// recherche une liste précise d' un utilisateur
listDAO.findListByIdUserAndIdList = async (idUser,id) => {
    const rows = await listDAO.query('SELECT * FROM list_kanji WHERE id_user=? AND id=? ', [idUser,id]);
    return rows[0];
};

// Ajout d'une liste

listDAO.insertOneList = async id => {
    const rows = await query('SELECT * FROM ?? WHERE id=?', [this.tableName, id]);
    return rows[0][0];
};

module.exports = listDAO;