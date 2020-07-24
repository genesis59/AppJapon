const {DAO} = require('./dao');

const vocabDAO = new DAO('vocabulaire_kanji');

vocabDAO.findVocabularyById = async (id) => {
    const result = await vocabDAO.query(`SELECT * FROM view_vocab
    WHERE id = ?`,[id]);
    return result[0];
};

vocabDAO.findVocabularyByIdAndSymb = async (id,symbole) => {
    const result = await vocabDAO.query(`SELECT * FROM view_vocab
    WHERE id = ? AND symbole=?`,[id,symbole]);
    return result[0];
};


module.exports = vocabDAO;