
import { Student, Activity, ClassStats, ListStats, QuestionStat } from '../types';

export interface RawResponse {
    timestamp: string;
    email: string;
    name: string;
    class: string;
    scoreString: string;
    [key: string]: string;
}

export const fetchSheetData = async (sheetUrl: string): Promise<RawResponse[]> => {
    try {
        const response = await fetch(sheetUrl);
        const csvData = await response.text();

        // Handle both comma and semi-colon (common in Brazil)
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const delimiter = lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));

        return lines.slice(1).map(line => {
            const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });

            // Mapping based on the image provided:
            // A (0): Carimbo, B (1): Email, C (2): Pontuação, D (3): Nome, E (4): Turma
            return {
                timestamp: values[0] || '',
                email: values[1] || '',
                scoreString: values[2] || '0',
                name: values[3] || '',
                class: values[4] || '',
                ...obj
            } as RawResponse;
        });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
};

export const processStats = (data: RawResponse[], targetActivities: number = 5) => {
    const classMap: Record<string, { totalScore: number; count: number; studentEmails: Set<string>; exercises: number }> = {};
    const studentMap: Record<string, { name: string; class: string; history: { month: string; score: number; listName?: string }[]; email: string }> = {};

    // Timeline Data for Evolution Chart
    const timelineMap: Record<string, { total: number; count: number }> = {};

    const listMap: Record<string, { totalScore: number; count: number }> = {};

    data.forEach(resp => {
        const className = resp.class || 'Sem Turma';
        const email = resp.email?.toLowerCase().trim();
        const name = resp.name?.toLowerCase().trim();

        // Detect Teacher (Atila)
        const isTeacher = email === 'profmatatila@gmail.com' || name === 'atila de oliveira';

        // Extract date from timestamp (format: "DD/MM/YYYY HH:mm:ss")
        const dateStr = resp.timestamp.split(' ')[0] || 'Sem Data';

        // Parse score
        let finalScore = 0;
        if (resp.scoreString.includes('/')) {
            const parts = resp.scoreString.split('/');
            const got = parseFloat(parts[0]);
            const total = parseFloat(parts[1]);
            if (!isNaN(got) && !isNaN(total) && total > 0) {
                finalScore = (got / total) * 10;
            }
        } else {
            const raw = parseFloat(resp.scoreString) || 0;
            finalScore = raw > 10 ? raw / 10 : raw;
        }

        // List Stats Logic
        let listName = '';
        const possibleListKeys = Object.keys(resp).filter(k =>
            (k.toLowerCase().includes('lista') ||
                k.toLowerCase().includes('atividade') ||
                k.toLowerCase().includes('quais') ||
                k.toLowerCase().includes('título')) &&
            !['name', 'class', 'email', 'timestamp', 'scoreString'].includes(k)
        );

        if (possibleListKeys.length > 0) listName = resp[possibleListKeys[0]];
        if (!listName || listName.length < 2) listName = `Lista ${dateStr}`;

        // If this is the teacher, we skip the general student/class stats
        // but the record will still be used in the question analysis loop below
        if (isTeacher) return;

        if (!listMap[listName]) {
            listMap[listName] = { totalScore: 0, count: 0 };
        }
        listMap[listName].totalScore += finalScore;
        listMap[listName].count += 1;

        if (!timelineMap[dateStr]) timelineMap[dateStr] = { total: 0, count: 0 };
        timelineMap[dateStr].total += finalScore;
        timelineMap[dateStr].count += 1;

        if (!classMap[className]) {
            classMap[className] = { totalScore: 0, count: 0, studentEmails: new Set(), exercises: 0 };
        }
        classMap[className].totalScore += finalScore;
        classMap[className].count += 1;
        classMap[className].studentEmails.add(email);
        classMap[className].exercises += 1;

        if (!studentMap[email]) {
            studentMap[email] = { name: resp.name, class: className, history: [], email };
        }
        studentMap[email].history.push({
            month: dateStr,
            score: Number((finalScore * 10).toFixed(1)),
            listName: listName
        });
    });

    const evolutionData = Object.entries(timelineMap).map(([date, data]) => ({
        month: date,
        score: Number(((data.total / data.count) * 10).toFixed(1)),
        avg: Number(((data.total / data.count) * 10).toFixed(1))
    })).sort((a, b) => {
        const [d1, m1, y1] = a.month.split('/').map(Number);
        const [d2, m2, y2] = b.month.split('/').map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    });

    const classStats: ClassStats[] = Object.entries(classMap).map(([name, data], idx) => ({
        id: String(idx + 1),
        name,
        period: 'Geral',
        studentCount: data.studentEmails.size,
        averageScore: (data.totalScore / data.count) * 10, // Back to 0-100 for display
        exercisesCount: data.exercises,
        progress: Math.min(100, (data.exercises / targetActivities) * 100)
    }));

    const listStats: ListStats[] = Object.entries(listMap).map(([name, data], idx) => ({
        id: String(idx + 1),
        name,
        averageScore: Number(((data.totalScore / data.count) * 10).toFixed(1)),
        submissionCount: data.count
    })).sort((a, b) => b.submissionCount - a.submissionCount);

    const students: Student[] = Object.entries(studentMap).map(([email, data], idx) => {
        const avg = data.history.reduce((a, b) => a + b.score, 0) / data.history.length;
        return {
            id: email,
            name: data.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=f1f5f9&color=64748b&bold=true`,
            class: data.class,
            average: Number(avg.toFixed(1)),
            trend: 0,
            exercisesDone: data.history.length,
            completionRate: 100,
            recentDrop: 0,
            history: data.history.sort((a, b) => {
                const [d1, m1, y1] = a.month.split('/').map(Number);
                const [d2, m2, y2] = b.month.split('/').map(Number);
                return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
            })
        };
    });

    const questionMap: Record<string, Record<string, Record<string, number>>> = {};
    const suggestedGabarito: Record<string, Record<string, string>> = {}; // ListName -> QuestionTitle -> Answer

    const excludedHeaders = [
        'name', 'class', 'email', 'timestamp', 'scorestring',
        'carimbo', 'data/hora', 'endereço', 'nome completo',
        'turma', 'pontuação', 'score', 'nota',
        'digite o seu nome', 'seu nome', 'qual o seu nome', 'identificação',
        'digite o seu'
    ].map(h => h.toLowerCase());

    data.forEach(resp => {
        // Detect Teacher (Atila)
        const email = resp.email?.toLowerCase().trim();
        const name = resp.name?.toLowerCase().trim();
        const isTeacher = email === 'profmatatila@gmail.com' || name === 'atila de oliveira';

        // Detect list name
        let rowListName = '';
        const possibleListKeys = Object.keys(resp).filter(k =>
            (k.toLowerCase().includes('lista') ||
                k.toLowerCase().includes('atividade') ||
                k.toLowerCase().includes('quais') ||
                k.toLowerCase().includes('título')) &&
            !['name', 'class', 'email', 'timestamp', 'scoreString'].includes(k)
        );
        if (possibleListKeys.length > 0) rowListName = resp[possibleListKeys[0]];
        if (!rowListName || rowListName.length < 2) rowListName = `Lista ${resp.timestamp.split(' ')[0] || 'Sem Data'}`;

        // Check for perfect score to extract gabarito (fallback if teacher didn't submit)
        let isPerfect = false;
        if (resp.scoreString.includes('/')) {
            const [got, total] = resp.scoreString.split('/').map(n => parseFloat(n));
            if (got === total && total > 0) isPerfect = true;
        }

        // Question Analysis logic
        Object.entries(resp).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            if (excludedHeaders.some(h => lowerKey.includes(h))) return;
            if (!value || value.length === 0) return;

            // If this is the teacher, store these answers as THE definitive suggested gabarito
            if (isTeacher) {
                if (!suggestedGabarito[rowListName]) suggestedGabarito[rowListName] = {};
                suggestedGabarito[rowListName][key] = value;
                return; // Don't add teacher answers to student distribution counts
            }

            // Normal student response tracking
            if (!questionMap[rowListName]) questionMap[rowListName] = {};
            if (!questionMap[rowListName][key]) questionMap[rowListName][key] = {};
            if (!questionMap[rowListName][key][value]) questionMap[rowListName][key][value] = 0;
            questionMap[rowListName][key][value] += 1;

            // Fallback: If this is a student's perfect score row, store as suggested if no teacher key yet
            if (isPerfect && (!suggestedGabarito[rowListName] || !suggestedGabarito[rowListName][key])) {
                if (!suggestedGabarito[rowListName]) suggestedGabarito[rowListName] = {};
                suggestedGabarito[rowListName][key] = value;
            }
        });
    });

    const questionStats: QuestionStat[] = [];
    Object.entries(questionMap).forEach(([listName, listQuestions]) => {
        Object.entries(listQuestions).forEach(([title, answers], qIdx) => {
            const totalAnswers = Object.values(answers).reduce((a, b) => a + b, 0);
            const distribution = Object.entries(answers).map(([answer, count]) => ({
                answer,
                count,
                percentage: Number(((count / totalAnswers) * 100).toFixed(1))
            })).sort((a, b) => b.count - a.count);

            questionStats.push({
                id: `${listName}-${qIdx}`,
                title,
                listName,
                totalAnswers,
                distribution,
                mostCommonAnswer: distribution[0]?.answer || '',
                suggestedCorrect: suggestedGabarito[listName]?.[title]
            });
        });
    });

    return { classStats, students, evolutionData, listStats, questionStats };
};
