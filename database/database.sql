DROP DATABASE IF EXISTS japon;

CREATE DATABASE japon DEFAULT CHARACTER SET utf8;

USE japon;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT,
    lastname VARCHAR(100),
    firstname VARCHAR(100),
    pseudo VARCHAR(100),
    email VARCHAR(100),
    pass VARCHAR(100),
    date_inscription DATE NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO users(lastname,firstname,pseudo,email,pass,date_inscription)
VALUES ('dupont','jean','violon','dupont@mail.fr',123,'2020-07-03'),
('durand','claire','ballon','durand@mail.fr',456,'2020-07-04'),
('villon','jeanne','caramel','villon@mail.fr',789,'2020-07-05'),
('doe','john','parachute','doe@mail.fr',987,'2020-07-06');

CREATE TABLE kanji (
    id INT UNSIGNED AUTO_INCREMENT,
    id_user INT UNSIGNED,
    symbole VARCHAR(30),
    nombreTrait VARCHAR(10),
    add_list TINYINT (1) NOT NULL,
    CONSTRAINT kanji_to_users
    FOREIGN KEY (id_user)
    REFERENCES users(id),
    PRIMARY KEY (id)
);

INSERT INTO kanji(symbole,nombreTrait)
VALUES ('人',2),('ー',1),('二',2),('三',3),('日',4),('四',5),('五',5);

CREATE TABLE lecture (
    id INT UNSIGNED AUTO_INCREMENT,
    id_kanji INT UNSIGNED,
    onyomi VARCHAR(100),
    kunyomi VARCHAR(100),
    trad_fr VARCHAR(100),
    CONSTRAINT lecture_to_kanji
        FOREIGN KEY (id_kanji)
        REFERENCES kanji(id),
    PRIMARY KEY (id)
);

INSERT INTO lecture(id_kanji,onyomi,kunyomi,trad_fr)
VALUES (1,'JIN,NIN','hito','être humain,homme,personne'),(2,'ICHI,ITSU','hito(tsu),hito','un'),
(3,'NI','futa(tsu),futa','deux'),(4,'SAN','mit(tsu),mi(tsu),mi-','trois'),(5,'NICHI,JITSU','hi,-ka','jour,soleil'),
(6,'SHI','yot(tsu),yo(tsu),yo-,yon','quatre'),(7,'GO','itsu(tsu),itsu-','cinq');

CREATE TABLE vocabulaire_kanji (
    id INT UNSIGNED AUTO_INCREMENT,
    id_kanji INT UNSIGNED,
    kanji_japonais VARCHAR(100),
    prononciation VARCHAR(100),
    trad_fr VARCHAR(100),
    CONSTRAINT vocabulaire_kanji_to_kanji
        FOREIGN KEY (id_kanji)
        REFERENCES kanji(id),
    PRIMARY KEY (id)
);

INSERT INTO vocabulaire_kanji(id_kanji,kanji_japonais,prononciation,trad_fr)
VALUES (1,'フランス人','Furansujin','Français'),(1,'100人','hyakunin','cent personnes'),
(1,'5、6人','go-rokunin','cinq ou six personnes'),(1,'あの人','ano hito','cette personne,il,elle'),
(1,'人々、人びと','hitobito','les gens'),
(2,'ーページ','ichipēji','une page'),(2,'ー々','ichi-ichi','un par un,tous les détails'),
(2,'一つ一つ','hitotsu-hitotsu','un par un (choses)'),(2,'ー人','hitori','une personne,seul(e)'),
(2,'ー人ー人','hitori-hitori','un par un,un après l''autre(personnes)'),
(3,'二人','futari,ninin','deux personnes'),(3,'ー人二人','hitori-futari','une ou deux personnes'),
(3,'二人ずつ','futarizutsu','deux par deux (personnes)'),(3,'二つずつ','futatsuzutsu','deux par deux (choses)'),
(3,'二人とも','futaritomo','tous les deux (personnes)'),
(4,'三人','sannin','trois personnes'),(4,'二、三人','ni-sannin','deux ou trois personnes'),
(4,'三キロ','san kiro','3 kg,3 km'),(4,'三ぞろい','mitsuzoroi','complet-veston'),(4,'二つ三つ','futatsu mittsu','deux ou trois'),
(5,'一日','ichinichi,ichijitsu','un jour'),(5,'一日','tsuitachi','le premier du mois'),
(5,'二日','futsuka','le 2 (date),deux jours'),(5,'三日','mikka','le 3 (date),trois jours'),
(5,'二、三日','ni-sannichi','deux ou trois jours'),
(6,'四人','yonin','quatre personnes'),(6,'四日','yokka','le 4 (date),quatre jours'),
(6,'三、四日','san-yokka','trois ou quatre jours'),(6,'三、四人','san-yonin','trois ou quatre personnes'),
(6,'四つんばい','yotsunbai','à quatre pattes'),
(7,'五人','gonin','cinq personnes'),(7,'五日','itsuka','le 5 (date),cinq jours'),
(7,'四、五日','shi-gonichi','quatre ou cinq jours'),(7,'四、五人','shi-gonin','quatre ou cinq personnes'),
(7,'三々五々','san-san go-go','par petits groupes');

CREATE OR REPLACE VIEW view_vocab AS
SELECT k.id,k.symbole,v.kanji_japonais,v.prononciation,v.trad_fr FROM kanji k
INNER JOIN lecture l ON k.id = l.id_kanji
INNER JOIN vocabulaire_kanji v ON v.id_kanji = k.id;


CREATE TABLE list_kanji (
    id INT UNSIGNED AUTO_INCREMENT,
    id_user INT UNSIGNED,
    list_name VARCHAR(100),
    CONSTRAINT list_kanji_to_users
        FOREIGN KEY (id_user)
        REFERENCES users(id),
    PRIMARY KEY (id)
);

INSERT INTO list_kanji(id_user,list_name)
VALUES (1,'mes kanji connus'),(1,'mes kanji à réviser'),
(2,'mes kanji préférés'),(2,'mes kanji à apprendre'),
(3,'mes super kanji'),(3,'kanji difficile');