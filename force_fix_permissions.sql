-- SOLUÇÃO DEFINITIVA PARA ERRO DE UPLOAD
-- RODE ESTE SCRIPT NO "SQL EDITOR" DO SUPABASE
-- Ele vai liberar geral o upload para a pasta 'quiz-assets'

BEGIN;

-- 1. Garante que o bucket existe e é público
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-assets', 'quiz-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. DERRUBA TODAS AS POLÍTICAS ANTIGAS (Limpeza total)
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- 3. CRIA POLÍTICAS 100% PÚBLICAS (Sem exigir login)
-- Isso resolve o problema se o seu usuário não estiver sendo detectado corretamente.

-- Qualquer um pode VER as imagens
CREATE POLICY "Public Select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quiz-assets');

-- Qualquer um pode ENVIAR imagens para essa pasta
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'quiz-assets');

-- Qualquer um pode ATUALIZAR imagens nessa pasta
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'quiz-assets');

COMMIT;
