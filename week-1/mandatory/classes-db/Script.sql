CREATE TABLE mentors1 (
    id SERIAL primary key,
    name VARCHAR(30) NOT NULL,
    years_in_glasglow SMALLINT NOT NULL,
    language VARCHAR(30) NOT NULL,
    adress VARCHAR(100) NOT NULL
);



INSERT INTO mentors1 (name, years_in_glasglow, adress, language) values ('Mimi', 3, 'Plaza Espa�a, 3', 'c++');


INSERT INTO mentors1 (name, years_in_glasglow, adress, language) values ('Jojo', 5, 'Plaza Espa�a, 4', 'Java');


INSERT INTO mentors1 (name, years_in_glasglow, adress, language) values ('Ana', 50, '5th Avenue, 45', 'c++');


INSERT INTO mentors1 (name, years_in_glasglow, adress, language) values ('Jane','5', 'Marina Strret, 67', 'Java');


INSERT INTO mentors1 (name, years_in_glasglow, adress, language) values ('Pedro', 45, 'Plaza Lluis Casasas', 'React');




CREATE TABLE students1 (
    id SERIAL primary key,
    name VARCHAR(30) NOT NULL,
    adress VARCHAR(100) NOT null,
    graduated_from_cyf BOOLEAN
);



INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Joana', 'Plaza dos', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Jenny', 'Principal street', false);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Joana', 'Plaza dos', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Paul', '4th Street', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Carol', 'Big Bang', false);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Rosalia', 'Sunny Street', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Mary', 'Last Street', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Carla', 'Calle 3', false);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Fran', '45th Street', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Tafarel', 'Calle del Amor', true);

INSERT INTO students1 (name, adress, graduated_from_cyf) values ('Pablo', 'Calle Roja', true);


CREATE TABLE classes (
    id SERIAL primary key,
    mentor_id INT references mentors1(id),
    topic varchar(50) not null,
    date DATE not null,
    location varchar(50) not null
);

INSERT INTO classes (mentor_id, topic, date, location) VALUES (1, 'Python','2021-11-11','Barcelona');
INSERT INTO classes (mentor_id, topic, date, location) VALUES (4, 'Java','2021-11-09','Barcelona');
INSERT INTO classes (mentor_id, topic, date, location) VALUES (3, 'JavaScript','2021-11-04','Barcelona');



create table attendance (
    id SERIAL primary key,
    student_id int references students1(id),
    class_id int references classes(id)
);

INSERT INTO attendance (student_id, class_id) values (5, 1);
INSERT INTO attendance (student_id, class_id) values (5, 4);
INSERT INTO attendance (student_id, class_id) values (10, 3);
INSERT INTO attendance (student_id, class_id) values (2, 1);
INSERT INTO attendance (student_id, class_id) values (6, 4);
INSERT INTO attendance (student_id, class_id) values (7, 3);
INSERT INTO attendance (student_id, class_id) values (6, 1);
INSERT INTO attendance (student_id, class_id) values (9, 4);


SELECT * FROM attendance; 

SELECT * FROM classes;

SELECT * FROM mentors1;

SELECT * FROM students1;

SELECT * FROM students1 where graduated_from_cyf is false;

SELECT * FROM mentors1 where language = 'Java';

SELECT * FROM students1 where  graduated_from_cyf = true;

SELECT * FROM classes where date < '2021-11-10';

SELECT student_id from attendance where class_id = 3;





