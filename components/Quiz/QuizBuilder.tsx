import React, { useState, useEffect, useRef } from 'react';
import { quizService } from '../../services/quizService';
import { Question } from '../../types';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const generateId = () => Math.random().toString(36).substr(2, 9);

const MATH_SYMBOLS = [
    // Powers / Superscripts
    { label: 'x⁰', value: '⁰' }, { label: 'x¹', value: '¹' }, { label: 'x²', value: '²' }, { label: 'x³', value: '³' },
    { label: 'x⁴', value: '⁴' }, { label: 'x⁵', value: '⁵' }, { label: 'x⁶', value: '⁶' }, { label: 'xⁿ', value: 'ⁿ' },

    // Fractions
    { label: '½', value: '½' }, { label: '⅓', value: '⅓' }, { label: '¼', value: '¼' }, { label: '¾', value: '¾' },

    // Operators & Symbols
    { label: '√', value: '√' }, { label: 'π', value: 'π' }, { label: '∞', value: '∞' }, { label: '≠', value: '≠' },
    { label: '≤', value: '≤' }, { label: '≥', value: '≥' }, { label: '±', value: '±' }, { label: '÷', value: '÷' },
    { label: '×', value: '×' }, { label: 'Δ', value: 'Δ' }, { label: '∫', value: '∫' }, { label: '≈', value: '≈' }
];

interface QuizBuilderProps {
    editingQuizId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function QuizBuilder({ editingQuizId, onSuccess, onCancel }: QuizBuilderProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [customHeader, setCustomHeader] = useState('');
    const [className, setClassName] = useState('');
    const [questions, setQuestions] = useState<Partial<Question>[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [uploading, setUploading] = useState(false);

    // Tracks original question IDs to handle deletions during edit
    const [originalQuestionIds, setOriginalQuestionIds] = useState<string[]>([]);

    // Load existing quiz if editing
    useEffect(() => {
        if (editingQuizId) {
            loadQuizData(editingQuizId);
        }
    }, [editingQuizId]);

    const loadQuizData = async (id: string) => {
        setLoading(true);
        try {
            const { quiz, questions: qData } = await quizService.getQuizDetails(id);
            setTitle(quiz.title);
            setDescription(quiz.description || '');
            setCustomHeader(quiz.custom_header || '');
            setClassName(quiz.target_class || '');

            // Add local ID for rendering stability
            const questionsWithLocalId = (qData || []).map(q => ({
                ...q,
                _tempId: generateId()
            }));

            setQuestions(questionsWithLocalId);
            setOriginalQuestionIds((qData || []).map(q => q.id));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            text: '',
            image_url: '',
            type: 'multiple_choice',
            points: 1,
            options: [
                { label: 'A', text: '', isCorrect: false },
                { label: 'B', text: '', isCorrect: false },
                { label: 'C', text: '', isCorrect: false },
                { label: 'D', text: '', isCorrect: false }
            ],
            // @ts-ignore
            _tempId: generateId()
        }]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];

        // Auto-fix Google Drive Links
        if (field === 'image_url' && typeof value === 'string') {
            const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
            const match = value.match(driveRegex);
            if (match && match[1]) {
                value = `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
        }

        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const [activeField, setActiveField] = useState<{ qIdx: number, type: 'text' | 'option', oIdx?: number } | null>(null);

    const insertSymbol = (qIdx: number, symbol: string) => {
        const targetType = (activeField?.qIdx === qIdx) ? activeField.type : 'text';
        const targetOIdx = (activeField?.qIdx === qIdx) ? activeField.oIdx : 0;

        if (targetType === 'text') {
            const currentText = questions[qIdx].text || '';
            updateQuestion(qIdx, 'text', currentText + symbol);
        } else if (targetType === 'option' && typeof targetOIdx === 'number') {
            const currentOptText = questions[qIdx].options![targetOIdx].text;
            updateOption(qIdx, targetOIdx, currentOptText + symbol);
        }
    };

    const updateOption = (qIndex: number, oIndex: number, text: string) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options) {
            newQuestions[qIndex].options![oIndex].text = text;
        }
        setQuestions(newQuestions);
    };

    const setCorrectOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options) {
            newQuestions[qIndex].options = newQuestions[qIndex].options!.map((opt, idx) => ({
                ...opt,
                isCorrect: idx === oIndex
            }));
        }
        setQuestions(newQuestions);
    };

    const handleFileUpload = async (index: number, file: File) => {
        setUploading(true);
        try {
            const url = await quizService.uploadImage(file);
            updateQuestion(index, 'image_url', url);
        } catch (error: any) {
            console.error(error);
            const msg = error.message || 'Erro desconhecido';
            alert(`Erro no Upload: ${msg}\n\nVerifique se rodou o script de permissões no Supabase.`);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (status: 'draft' | 'published') => {
        if (!title) return alert('Título é obrigatório');
        setLoading(true);
        try {
            let quizId = editingQuizId;

            if (editingQuizId) {
                // UPDATE QUIZ
                await quizService.updateQuiz(editingQuizId, {
                    title,
                    description,
                    custom_header: customHeader,
                    target_class: className,
                    status
                });

                // Handle Questions
                const currentIds = questions.map(q => q.id).filter(Boolean);
                const toDelete = originalQuestionIds.filter(id => !currentIds.includes(id));
                for (const id of toDelete) {
                    await quizService.deleteQuestion(id);
                }

                // Update or Insert
                for (const q of questions) {
                    const qPayload = {
                        quiz_id: quizId!,
                        text: q.text!,
                        image_url: q.image_url,
                        type: q.type || 'multiple_choice',
                        points: q.points || 1,
                        options: q.options,
                        correct_answer: q.correct_answer
                    };

                    if (q.id) {
                        await quizService.updateQuestion(q.id, qPayload);
                    } else {
                        await quizService.addQuestion(qPayload);
                    }
                }

                if (status === 'published') {
                    const link = `${window.location.origin}/?quizId=${editingQuizId}`;
                    setGeneratedLink(link);
                    alert('Quiz atualizado e publicado com sucesso!');
                } else {
                    alert('Rascunho atualizado com sucesso!');
                }

                if (onSuccess) onSuccess();

            } else {
                // CREATE NEW QUIZ
                const quiz = await quizService.createQuiz({
                    title,
                    description,
                    custom_header: customHeader,
                    target_class: className,
                    status,
                    is_active: true
                });
                quizId = quiz.id;

                for (const q of questions) {
                    if (q.text) {
                        await quizService.addQuestion({
                            quiz_id: quiz.id,
                            text: q.text!,
                            image_url: q.image_url,
                            type: q.type || 'multiple_choice',
                            points: q.points || 1,
                            options: q.options,
                            correct_answer: q.correct_answer
                        });
                    }
                }

                if (status === 'published') {
                    const link = `${window.location.origin}/?quizId=${quiz.id}`;
                    setGeneratedLink(link);
                    alert('Quiz publicado com sucesso!');
                } else {
                    alert('Rascunho salvo com sucesso!');
                    if (onSuccess) onSuccess();
                }
            }

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar quiz');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copiado!');
    };

    // Memoized Quill Modules to prevent re-initialization crashes
    // const modules = React.useMemo(() => ({
    //     toolbar: [
    //         ['bold', 'italic', 'underline', 'strike'],
    //         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //         ['link', 'clean']
    //     ],
    // }), []);

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {generatedLink && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Quiz Publicado!</h2>
                            <p className="text-slate-500 mt-2">Seu quiz está pronto para ser compartilhado.</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 break-all text-sm text-slate-600 font-mono">
                            {generatedLink}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={copyLink}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">content_copy</span>
                                Copiar Link
                            </button>
                            <button
                                onClick={() => onSuccess && onSuccess()}
                                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onCancel && (
                        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-slate-800">
                        {editingQuizId ? 'Editar Quiz' : 'Criar Novo Quiz (Estilo Forms)'}
                    </h1>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Configurações Gerais</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Header Simulator */}
                        <div className="col-span-2 bg-slate-50 p-6 rounded-lg border border-slate-200 text-center mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Simulação do Cabeçalho</p>
                            <h1 className="text-xl font-bold text-slate-800">{customHeader ? 'Matemática Online' : 'Matemática Online'}</h1>
                            <p className="font-medium text-slate-600">Prof. Átila de Oliveira</p>
                            <p className="text-sm text-slate-500 mt-1 italic">{customHeader || 'Seus dizeres aparecerão aqui...'}</p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Título do Quiz</label>
                            <input
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 border font-bold text-lg" // Added font-bold and text-lg
                                value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Avaliação de Funções"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Dizeres Personalizados (Cabeçalho)</label>
                            <textarea
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 border"
                                value={customHeader} onChange={e => setCustomHeader(e.target.value)}
                                placeholder="Ex: 'Boa prova a todos!'"
                                rows={2}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Instruções</label>
                            <textarea
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 border"
                                value={description} onChange={e => setDescription(e.target.value)}
                                placeholder="Instruções para o aluno..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Turma Alvo (Opcional)</label>
                            <input
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 border"
                                value={className} onChange={e => setClassName(e.target.value)}
                                placeholder="Ex: 3001"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, qIdx) => (
                        // @ts-ignore
                        <div key={q._tempId || q.id || qIdx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 relative group">
                            <div className="flex justify-between items-center mb-6" id={`q-header-${qIdx}`}>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-400">Questão {qIdx + 1}</h3>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <select
                                        className="border-slate-300 rounded-md shadow-sm p-2 text-sm border font-medium text-slate-700 bg-white cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 min-w-[160px]"
                                        value={q.type || 'multiple_choice'}
                                        onChange={e => updateQuestion(qIdx, 'type', e.target.value)}
                                    >
                                        <option value="multiple_choice" className="bg-white py-2">Múltipla Escolha</option>
                                        <option value="text" className="bg-white py-2">Discursiva</option>
                                    </select>
                                    <button
                                        onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                                        className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 px-3 py-1 rounded"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div onClick={() => setActiveField({ qIdx, type: 'text' })}>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Enunciado</label>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {MATH_SYMBOLS.map(sym => (
                                            <button
                                                key={sym.label}
                                                onClick={() => insertSymbol(qIdx, sym.value)}
                                                className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                                                title={`Inserir ${sym.label}`}
                                            >
                                                {sym.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-md overflow-hidden">
                                        {/* 
                                        <ReactQuill
                                            theme="snow"
                                            value={q.text || ''}
                                            onChange={(value) => updateQuestion(qIdx, 'text', value)}
                                            modules={modules}
                                            className="h-32 mb-10" // mb-10 to account for toolbar
                                            placeholder="Digite o enunciado da questão..."
                                        /> 
                                        */}
                                        <textarea
                                            className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y font-sans text-slate-700 leading-relaxed"
                                            value={q.text || ''}
                                            onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                                            placeholder="Digite o enunciado da questão..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Imagem da Questão (Opcional)</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                            <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 max-w-max">
                                                <span className="material-symbols-outlined text-xl">cloud_upload</span>
                                                {uploading ? 'Enviando...' : 'Fazer Upload de Imagem'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={uploading}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleFileUpload(qIdx, e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <span className="text-xs text-slate-400">ou cole um link abaixo</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                className="w-full border-slate-300 rounded-md shadow-sm p-2 border text-sm bg-slate-50"
                                                value={q.image_url} onChange={e => updateQuestion(qIdx, 'image_url', e.target.value)}
                                                placeholder="https://exemplo.com/imagem.png"
                                            />
                                        </div>
                                    </div>

                                    {q.image_url && (
                                        <div className="mt-2 p-2 border rounded bg-slate-50 inline-block relative group">
                                            <button
                                                onClick={() => updateQuestion(qIdx, 'image_url', '')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                title="Remover Imagem"
                                            >
                                                <span className="material-symbols-outlined text-sm block">close</span>
                                            </button>
                                            <img
                                                src={q.image_url}
                                                alt="Preview"
                                                className="h-32 object-contain bg-white"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement?.classList.add('bg-red-50', 'border-red-200');
                                                    const errorMsg = document.createElement('span');
                                                    errorMsg.className = 'text-red-500 text-xs font-bold';
                                                    errorMsg.innerText = 'Erro ao carregar';
                                                    e.currentTarget.parentElement?.appendChild(errorMsg);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {q.type !== 'text' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options?.map((opt, oIdx) => (
                                        <div key={oIdx} onClick={() => setActiveField({ qIdx, type: 'option', oIdx })} className="flex items-center space-x-2">
                                            <div
                                                onClick={(e) => { e.stopPropagation(); setCorrectOption(qIdx, oIdx); }}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer font-bold border transition-colors ${opt.isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'}`}
                                            >
                                                {opt.label}
                                            </div>
                                            <input
                                                className="flex-1 border-slate-300 rounded-md shadow-sm p-2 border text-sm"
                                                value={opt.text} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                                placeholder={`Opção ${opt.label}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">subject</span>
                                    <p className="text-slate-500 font-medium">Questão Discursiva</p>
                                    <p className="text-sm text-slate-400">O aluno terá um espaço de texto livre para responder.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 sticky bottom-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg">
                    <button
                        onClick={addQuestion}
                        className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-bold flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Adicionar Questão
                    </button>
                    <div className="flex-1"></div>

                    <button
                        onClick={() => handleSave('draft')}
                        disabled={loading || uploading}
                        className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">draft</span>
                        Salvar Rascunho
                    </button>

                    <button
                        onClick={() => handleSave('published')}
                        disabled={loading || uploading}
                        className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">rocket_launch</span>
                        {loading ? 'Publicando...' : 'Publicar Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
}

