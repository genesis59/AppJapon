const {DAO} = require('./dao');

const kanjiDAO = new DAO('kanji');


kanjiDAO.allKanji= async () => {
    const result = await kanjiDAO.query(`SELECT * FROM kanji k
    INNER JOIN lecture l ON k.id = l.id_kanji;`);
    return result[0];
};

kanjiDAO.findKanjiBySearch= async (value) => {
    const result = await kanjiDAO.query(`SELECT * FROM kanji k
    INNER JOIN lecture l ON k.id = l.id_kanji WHERE symbole = ?
    OR trad_fr LIKE CONCAT('%',?,'%');`,[value,value]);
    return result[0];
};

kanjiDAO.findKanjiBySearchFieldWithLimit= async (field,value,page) => {
    const result = await kanjiDAO.query(`SELECT * FROM kanji k
    INNER JOIN lecture l ON k.id = l.id_kanji WHERE ?? LIKE CONCAT('%',?,'%') LIMIT ?,5;`,[field,value,page]);
    return result[0];
};

kanjiDAO.findPagesSearch= async (field,value) => {
    const result = await kanjiDAO.query(`SELECT * FROM kanji k
    INNER JOIN lecture l ON k.id = l.id_kanji WHERE ?? LIKE CONCAT('%',?,'%');`,[field,value]);
    return result[0].length;
};


module.exports = kanjiDAO;