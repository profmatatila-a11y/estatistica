
import { Student, Activity, ClassStats } from '../types';

export interface RawResponse {
    timestamp: string;
    email: string;
    name: string;
    class: string;
    [key: string]: string; // For question answers
}

export const fetchSheetData = async (sheetUrl: string): Promise<RawResponse[]> => {
    try {
        const response = await fetch(sheetUrl);
        const csvData = await response.text();

        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });

            // Map standard fields based on common Google Forms headers or position
            // For a more robust solution, we'd want to explicitly define which column is what
            // but here we rely on the user having: carimbo de data/hora (timestamp), email, nome, turma
            return {
                timestamp: values[0],
                email: values[1],
                name: values[2],
                class: values[3],
                ...obj
            } as RawResponse;
        });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
};

export const processStats = (data: RawResponse[]) => {
    // Logic to calculate stats from raw responses
    const classMap: Record<string, { totalScore: number; count: number; studentEmails: Set<string>; exercises: number }> = {};
    const studentMap: Record<string, { name: string; class: string; scores: number[]; email: string }> = {};

    data.forEach(resp => {
        const className = resp.class || 'Sem Turma';
        const email = resp.email;
        const name = resp.name;

        // Identify numerical answers (grades)
        // For this example, let's assume columns after index 3 might contain scores or we can parse numbers
        let score = 0;
        let scoreCount = 0;
        Object.keys(resp).forEach((key, idx) => {
            if (idx > 3 && !isNaN(parseFloat(resp[key]))) {
                score += parseFloat(resp[key]);
                scoreCount++;
            }
        });
        const avgScore = scoreCount > 0 ? score / scoreCount : 0;

        // Class Stats
        if (!classMap[className]) {
            classMap[className] = { totalScore: 0, count: 0, studentEmails: new Set(), exercises: 0 };
        }
        classMap[className].totalScore += avgScore;
        classMap[className].count += 1;
        classMap[className].studentEmails.add(email);
        classMap[className].exercises += 1;

        // Student Stats
        if (!studentMap[email]) {
            studentMap[email] = { name, class: className, scores: [], email };
        }
        studentMap[email].scores.push(avgScore);
    });

    const classStats: ClassStats[] = Object.entries(classMap).map(([name, data], idx) => ({
        id: String(idx + 1),
        name,
        period: 'Geral',
        studentCount: data.studentEmails.size,
        averageScore: data.count > 0 ? (data.totalScore / data.count) : 0,
        exercisesCount: data.exercises,
        progress: Math.min(100, (data.exercises / 10) * 100) // Mock progress logic
    }));

    const students: Student[] = Object.entries(studentMap).map(([email, data], idx) => {
        const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        return {
            id: String(idx + 1),
            name: data.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            class: data.class,
            average: Number(avg.toFixed(1)),
            trend: 0,
            exercisesDone: data.scores.length,
            completionRate: 100,
            recentDrop: 0
        };
    });

    return { classStats, students };
};
