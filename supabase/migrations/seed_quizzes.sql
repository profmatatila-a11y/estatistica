-- Quiz 1: Desafio de Álgebra (ID Pré-definido)
INSERT INTO public.quizzes (id, title, description, custom_header, target_class, is_active)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Desafio de Álgebra Básica', 
    'Teste seus conhecimentos em equações e fatoração.', 
    '<p>Boa sorte, futuros matemáticos!</p>', 
    '3001', 
    true
);

INSERT INTO public.questions (quiz_id, text, type, points, options, correct_answer)
VALUES 
(
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Qual o valor de x na equação 2x + 10 = 20?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"5","isCorrect":true},{"label":"B","text":"10","isCorrect":false},{"label":"C","text":"2","isCorrect":false},{"label":"D","text":"15","isCorrect":false}]', 
    NULL
),
(
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Expanda a expressão: (x + 3)(x - 3)', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"x² + 6x + 9","isCorrect":false},{"label":"B","text":"x² - 9","isCorrect":true},{"label":"C","text":"x² - 6x + 9","isCorrect":false},{"label":"D","text":"x² + 9","isCorrect":false}]', 
    NULL
),
(
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Fatore a expressão: x² + 5x + 6', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"(x + 1)(x + 6)","isCorrect":false},{"label":"B","text":"(x + 2)(x + 3)","isCorrect":true},{"label":"C","text":"(x - 2)(x - 3)","isCorrect":false},{"label":"D","text":"(x + 5)(x + 1)","isCorrect":false}]', 
    NULL
),
(
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Se f(x) = 3x - 1, qual o valor de f(4)?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"10","isCorrect":false},{"label":"B","text":"11","isCorrect":true},{"label":"C","text":"12","isCorrect":false},{"label":"D","text":"13","isCorrect":false}]', 
    NULL
),
(
    'a1b2c3d4-e5f6-4a5b-8c9d-1234567890ab', 
    'Resolva para y: 3y - 9 = 0', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"0","isCorrect":false},{"label":"B","text":"3","isCorrect":true},{"label":"C","text":"9","isCorrect":false},{"label":"D","text":"-3","isCorrect":false}]', 
    NULL
);

-- Quiz 2: Geometria Plana (ID Pré-definido)
INSERT INTO public.quizzes (id, title, description, custom_header, target_class, is_active)
VALUES (
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'Conceitos de Geometria', 
    'Avaliação sobre áreas, perímetros e ângulos.', 
    '<p>Lembre-se das fórmulas!</p>', 
    '3002', 
    true
);

INSERT INTO public.questions (quiz_id, text, type, points, options, correct_answer)
VALUES 
(
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'Qual a área de um quadrado de lado 5cm?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"20 cm²","isCorrect":false},{"label":"B","text":"25 cm²","isCorrect":true},{"label":"C","text":"10 cm²","isCorrect":false},{"label":"D","text":"15 cm²","isCorrect":false}]', 
    NULL
),
(
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'A soma dos ângulos internos de um triângulo é:', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"90°","isCorrect":false},{"label":"B","text":"180°","isCorrect":true},{"label":"C","text":"360°","isCorrect":false},{"label":"D","text":"270°","isCorrect":false}]', 
    NULL
),
(
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'Qual o perímetro de um retângulo 3x4?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"12","isCorrect":false},{"label":"B","text":"14","isCorrect":true},{"label":"C","text":"7","isCorrect":false},{"label":"D","text":"20","isCorrect":false}]', 
    NULL
),
(
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'O Teorema de Pitágoras se aplica a qual tipo de triângulo?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"Equilátero","isCorrect":false},{"label":"B","text":"Retângulo","isCorrect":true},{"label":"C","text":"Isósceles","isCorrect":false},{"label":"D","text":"Escaleno","isCorrect":false}]', 
    NULL
),
(
    'b2c3d4e5-f6a7-4b8c-9d0e-0987654321ba', 
    'Qual é o valor de Pi (π) aproximado?', 
    'multiple_choice', 
    2, 
    '[{"label":"A","text":"3,10","isCorrect":false},{"label":"B","text":"3,14","isCorrect":true},{"label":"C","text":"3,00","isCorrect":false},{"label":"D","text":"3,41","isCorrect":false}]', 
    NULL
);
