-- RODE ESTE SCRIPT NO "SQL EDITOR" DO SUPABASE
-- Ele vai corrigir o erro de "Erro ao enviar imagem"

-- 1. Cria o bucket 'quiz-assets' se não existir e garante que é público
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-assets', 'quiz-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Limpa políticas antigas para evitar duplicação ou conflito
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- 3. Cria política para QUALQUER PESSOA ver as imagens (necessário para os alunos)
CREATE POLICY "Public Select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quiz-assets');

-- 4. Cria política para VOCÊ (logado) fazer upload das imagens
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quiz-assets');

-- 5. Opcional: Permitir apagar imagens (se quiser remover depois)
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quiz-assets');
