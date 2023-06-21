INSERT INTO role VALUES (default, 'PATIENT');
INSERT INTO role VALUES (default, 'DOCTOR');

INSERT INTO speciality VALUES (default, 'Терапевт');
INSERT INTO speciality VALUES (default, 'Хирург');
INSERT INTO speciality VALUES (default, 'Офтальмолог');

INSERT INTO users (id, surname, name, patronymic,
                   insurance_policy, email, password,
                   is_enabled, role_id, speciality_id)
            VALUES (default, 'Иванов', 'Иван', 'Иванович',
                    '1112223334445556', 'example1@mail.ru', '$2a$10$23tT7t5hTClfTrYPRR8rYejGSu.SXiZ.K5Hs4KippNAOgEuPtikXS',
                     true, 2, 1);

INSERT INTO users (id, surname, name, patronymic,
                   insurance_policy, email, password,
                   is_enabled, role_id, speciality_id)
VALUES (default, 'Петров', 'Петр', 'Петрович',
        '6555444333222111', 'example2@mail.ru', '$2a$10$X3CwGl3eMZeFnPJG/aRAlOVUtnCtIC0j1bogTdtBt9sCxVb/CDB02',
        true, 2, 1);

INSERT INTO users (id, surname, name, patronymic,
                   insurance_policy, email, password,
                   is_enabled, role_id, speciality_id)
VALUES (default, 'Истомин', 'Артемий', 'Всеволодович',
        '1112223334445557', 'shindayoni@gmail.com', '$2a$10$tDsi1ZBDRiqY3dwvRg/BkuT5WftMizHooloxXurbIzdSyv231Q/La',
        true, 1, null);

INSERT INTO users (id, surname, name, patronymic,
                   insurance_policy, email, password,
                   is_enabled, role_id, speciality_id)
VALUES (default, 'Истомина', 'Артемия', '',
        '1112223334445558', 'shindayoni1@gmail.com', '$2a$10$tDsi1ZBDRiqY3dwvRg/BkuT5WftMizHooloxXurbIzdSyv231Q/La',
        true, 1, null);

INSERT INTO appointment (id, doctor_id, patient_id, appointment_date)
        VALUES (default, 1, 3, now());

INSERT INTO survey_result (id, answer_text, passage_date, question_id, survey_id, patient_id)
    VALUES (default, 'Ответ 1', now(), 1, 5, 4);

INSERT INTO survey_result (id, answer_text, passage_date, question_id, survey_id, patient_id)
VALUES (default, 'Ответ 2', now(), 1, 2, 3);

INSERT INTO survey_result (id, answer_text, passage_date, question_id, survey_id, patient_id)
VALUES (default, 'Ответ 3', now(), 1, 2, 4);