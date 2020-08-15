const { DAO } = require('./dao');

const contentListDAO = new DAO('content_list');

contentListDAO.findAllById = async (id) => {
    const rows = await contentListDAO.query('SELECT * FROM view_detail_list WHERE id_list=?', [id]);
    return rows[0];
};

contentListDAO.findOneKanjiByIdAndList = async (id_kanji, id_list) => {
    const rows = await contentListDAO.query('SELECT * FROM content_list WHERE id_kanji=? AND id_list=?', [id_kanji, id_list]);
    return rows[0][0];
};

module.exports = contentListDAO;