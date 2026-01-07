import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TEMPLATE_FILE = path.join(__dirname, 'templates', 'teaching-prompt.md');

// Initialize Firestore
// In Cloud Run, it will automatically use the project's default credentials
const db = new Firestore();
const GEMS_COLLECTION = 'gems';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper to get grade context based on NEP pedagogical tiers
const getGradeContext = (grade: string, subject: string) => {
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

// Admin Routes
app.post('/api/generate-prompt', (req, res) => {
    const { subject, grade } = req.body;
    if (!subject || !grade) {
        return res.status(400).json({ error: 'Subject and grade are required' });
    }

    try {
        let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
        const gradeContext = getGradeContext(grade, subject);

        template = template.replace(/{{SUBJECT}}/g, subject);
        template = template.replace(/{{GRADE}}/g, grade);
        template = template.replace(/{{GRADE_CONTEXT}}/g, gradeContext);

        res.json({ prompt: template });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate prompt' });
    }
});

app.post('/api/gems', async (req, res) => {
    const { subject, grade, gemName, shareLink, promptText } = req.body;
    if (!subject || !grade || !gemName) {
        return res.status(400).json({ error: 'Subject, grade, and gemName are required' });
    }

    const id = `${subject.toLowerCase().replace(/\s+/g, '-')}-${grade}`;
    const newGem = {
        id,
        subject,
        grade,
        gemName,
        shareLink: shareLink || '',
        promptText: promptText || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        await db.collection(GEMS_COLLECTION).doc(id).set(newGem);
        res.status(201).json(newGem);
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to save Gem' });
    }
});

app.get('/api/gems', async (req, res) => {
    try {
        const snapshot = await db.collection(GEMS_COLLECTION).get();
        const gems = snapshot.docs.map(doc => doc.data());
        res.json(gems);
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to fetch Gems' });
    }
});

app.put('/api/gems/:id', async (req, res) => {
    const { id } = req.params;
    const { shareLink, gemName, promptText } = req.body;

    try {
        const gemRef = db.collection(GEMS_COLLECTION).doc(id);
        const doc = await gemRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Gem not found' });
        }

        const updateData: any = {
            updatedAt: new Date().toISOString()
        };
        if (shareLink !== undefined) updateData.shareLink = shareLink;
        if (gemName !== undefined) updateData.gemName = gemName;
        if (promptText !== undefined) updateData.promptText = promptText;

        await gemRef.update(updateData);
        const updatedDoc = await gemRef.get();
        res.json(updatedDoc.data());
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to update Gem' });
    }
});

app.delete('/api/gems/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection(GEMS_COLLECTION).doc(id).delete();
        res.status(204).send();
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to delete Gem' });
    }
});

// Teacher Routes
app.get('/api/gems/find', async (req, res) => {
    const { subject, grade } = req.query;
    if (!subject || !grade) {
        return res.status(400).json({ error: 'Subject and grade are required' });
    }

    try {
        const snapshot = await db.collection(GEMS_COLLECTION)
            .where('subject', '==', subject)
            .where('grade', '==', grade)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: 'Gem not found' });
        }

        res.json(snapshot.docs[0].data());
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to find Gem' });
    }
});

// Serve Admin Panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve Teacher Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
