import fs from 'fs';
import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'templates', 'teaching-prompt.md');

const db = new Firestore();
const PROMPTS_COLLECTION = 'pregenerated_prompts';

const BOARDS = ['Karnataka State', 'CBSE', 'ICSE', 'IGCSE'];
const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const getGradeContext = (grade: string) => {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 2) {
        return `### Tier: Foundational (Grade 1-2)
- Focus: Play-based, activity-based, and discovery-based learning.
- Examples: Household items (bottles, spoons), games (hide and seek), and family interactions.
- Complexity: Very simple English, short 3-5 word sentences. 
- Math focus: Counting, basic patterns, physical objects.
- Science/EVS focus: My body, animals, plants around us.`;
    } else if (gradeNum <= 5) {
        return `### Tier: Preparatory (Grade 3-5)
- Focus: Transition from play-based to more formal but interactive learning.
- Examples: Classroom objects, school activities, market visits, and local environment.
- Complexity: Simple grammar, 5-8 word sentences, clear conceptual labels.
- Math focus: Multiplication tables, fractions, simple geometry.
- Science focus: Life cycles, states of matter, plant parts.`;
    } else if (gradeNum <= 8) {
        return `### Tier: Middle (Grade 6-8)
- Focus: Subject-oriented pedagogical and curricular style. Abstract concepts start here.
- Examples: Community issues, historical events, scientific experiments, and sports.
- Complexity: Intermediate English, compound sentences, standard terminology with explanations.
- Math focus: Algebra, properties of shapes, basic statistics.
- Science focus: Human systems, chemical changes, force and pressure.`;
    } else {
        return `### Tier: Secondary (Grade 9-10)
- Focus: Greater depth, critical thinking, and preparation for rigorous study.
- Examples: Global issues, career paths, complex systems, and civic responsibility.
- Complexity: Standard academic English, technical vocabulary, logical reasoning.
- Math focus: Trigonometry, quadratic equations, theorems.
- Science focus: Genetics, periodic table, laws of motion.`;
    }
};

const getBoardContext = (board: string) => {
    switch (board) {
        case 'CBSE':
            return '### Board: CBSE\n- Align with NCERT curriculum and assessment patterns.\n- Focus on conceptual clarity and national standards.';
        case 'ICSE':
            return '### Board: ICSE\n- Focus on comprehensive and detailed explanations.\n- Emphasize application-based learning and English proficiency.';
        case 'IGCSE':
            return '### Board: IGCSE\n- Global perspective with inquiry-based learning.\n- Use international examples and practical applications.';
        case 'Karnataka State':
            return '### Board: Karnataka State Education Board\n- Align with state textbooks and local cultural context.\n- Use local examples and regional relevance.';
        default:
            return '';
    }
};

async function generateAll() {
    console.log('Starting prompt pre-generation...');
    const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

    for (const board of BOARDS) {
        for (const grade of GRADES) {
            const id = `${board.toLowerCase().replace(/\s+/g, '-')}-${grade}`;
            const gradeContext = getGradeContext(grade);
            const boardContext = getBoardContext(board);

            let prompt = template;
            prompt = prompt.replace(/{{SUBJECT}}/g, 'various subjects');
            prompt = prompt.replace(/{{GRADE}}/g, grade);
            prompt = prompt.replace(/{{GRADE_CONTEXT}}/g, gradeContext);
            prompt = prompt.replace(/{{BOARD}}/g, board);
            prompt = prompt.replace(/{{BOARD_CONTEXT}}/g, boardContext);

            await db.collection(PROMPTS_COLLECTION).doc(id).set({
                id,
                board,
                grade,
                prompt,
                generatedAt: new Date().toISOString()
            });

            console.log(`Generated: ${id}`);
        }
    }
    console.log('Pre-generation complete!');
}

generateAll().catch(console.error);
