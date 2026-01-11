import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
    ignoreUndefinedProperties: true
});

const GEMS_COLLECTION = 'gems';
const PREGENERATED_PROMPTS_COLLECTION = 'pregenerated_prompts';

const data = [
    { board: 'CBSE', grade: '1', link: 'https://gemini.google.com/gem/1285XnBSBVEZ7zGmSzOgD412Of0mCPuWG?usp=sharing' },
    { board: 'CBSE', grade: '10', link: 'https://gemini.google.com/gem/1x1qDiTDC-UHwTHsfWd8-WW-LoULBLqSa?usp=sharing' },
    { board: 'CBSE', grade: '11', link: 'https://gemini.google.com/gem/1aZED17qG25jpXrodznEB4ZvETDmaaqmB?usp=sharing' },
    { board: 'CBSE', grade: '12', link: 'https://gemini.google.com/gem/1aZED17qG25jpXrodznEB4ZvETDmaaqmB?usp=sharing' },
    { board: 'CBSE', grade: '2', link: 'https://gemini.google.com/gem/1Yj0q0ZdI6QMau_j4xH5FaXhHjQxn2nMe?usp=sharing' },
    { board: 'CBSE', grade: '3', link: 'https://gemini.google.com/gem/1iheZ6SLGbTT6MJ4AtTDtk5DceCwliP_J?usp=sharing' },
    { board: 'CBSE', grade: '4', link: 'https://gemini.google.com/gem/1jboV5CSMMGWb7BmMWW7UQUAA2V66P8D9?usp=sharing' },
    { board: 'CBSE', grade: '5', link: 'https://gemini.google.com/gem/1ZZtWxLUZ2-I5aplmH4dpHpb6q0TvdPr1?usp=sharing' },
    { board: 'CBSE', grade: '6', link: 'https://gemini.google.com/gem/1JilEviJJbN57ObUWpMccFC5lASaYNDk9?usp=sharing' },
    { board: 'CBSE', grade: '7', link: 'https://gemini.google.com/gem/1NYeBIoAq8-6YZ-F3wY2Kw5wGMoi0AEo8?usp=sharing' },
    { board: 'CBSE', grade: '8', link: 'https://gemini.google.com/gem/1fUZOS-LlzTrc16eOKKEPPuA0CfSSiNOU?usp=sharing' },
    { board: 'CBSE', grade: '9', link: 'https://gemini.google.com/gem/1OEEDAuVT1IqN2IEkvaR3c0nw9jd1r8B-?usp=sharing' },
    { board: 'ICSE', grade: '1', link: 'https://gemini.google.com/gem/1q3FlwZEiaJewNwAdaIhXL8fE0afP0DeK?usp=sharing' },
    { board: 'ICSE', grade: '10', link: 'https://gemini.google.com/gem/1Xr4krQl9tMhiGLzhV00NEvkVbk7B2xMG?usp=sharing' },
    { board: 'ICSE', grade: '11', link: 'https://gemini.google.com/gem/1gkpuQB80M7DdhNytecZqbckIN71MecjA?usp=sharing' },
    { board: 'ICSE', grade: '12', link: 'https://gemini.google.com/gem/1bnmXrfzyAudFRbUe0kWP3fNZKLhpWgir?usp=sharing' },
    { board: 'ICSE', grade: '2', link: 'https://gemini.google.com/gem/1gDeRBYJTz19bfkoEGsyQmVAm-blg8uBQ?usp=sharing' },
    { board: 'ICSE', grade: '3', link: 'https://gemini.google.com/gem/14PxojBa1b43R6j5Y-ZBTo5VC2bmVVHjX?usp=sharing' },
    { board: 'ICSE', grade: '4', link: 'https://gemini.google.com/gem/140XEDB8VE4LOLa_z3SEmRerWJaTwqWkf?usp=sharing' },
    { board: 'ICSE', grade: '5', link: 'https://gemini.google.com/gem/1PDnPaacrLhs-MrA1ek03jy0ISgdo0D7p?usp=sharing' },
    { board: 'ICSE', grade: '6', link: 'https://gemini.google.com/gem/15WGFYSMim0UenBLzYkEWqnx4v3zhFejw?usp=sharing' },
    { board: 'ICSE', grade: '7', link: 'https://gemini.google.com/gem/16uoeiTYQR2bqBuk4ANptz5guW85YlT_e?usp=sharing' },
    { board: 'ICSE', grade: '8', link: 'https://gemini.google.com/gem/1fGq0wIRlILqf1ZOUttYa63WLgs8Fj68J?usp=sharing' },
    { board: 'ICSE', grade: '9', link: 'https://gemini.google.com/gem/1dOLp8117McpDC9SYjRqSUAHYcvEikJrb?usp=sharing' },
    { board: 'IGCSE', grade: '1', link: 'https://gemini.google.com/gem/1SoUCP9qghSvT0w4M65N0yrndiCS6ifYO?usp=sharing' },
    { board: 'IGCSE', grade: '10', link: 'https://gemini.google.com/gem/1scY0GQ221tqxCST_TNGBPLYd4KzZr2bK?usp=sharing' },
    { board: 'IGCSE', grade: '11', link: 'https://gemini.google.com/gem/1qn-M1L0gMnpNW_pbURxu6Gg2JBi5tBH5?usp=sharing' },
    { board: 'IGCSE', grade: '12', link: 'https://gemini.google.com/gem/1qn-M1L0gMnpNW_pbURxu6Gg2JBi5tBH5?usp=sharing' },
    { board: 'IGCSE', grade: '2', link: 'https://gemini.google.com/gem/1pKswGtc2eUYuvS0cM1qO6HxyuLxeUS8S?usp=sharing' },
    { board: 'IGCSE', grade: '3', link: 'https://gemini.google.com/gem/6a4c0a15959f?usp=sharing' },
    { board: 'IGCSE', grade: '4', link: 'https://gemini.google.com/gem/b0338c548e1f?usp=sharing' },
    { board: 'IGCSE', grade: '5', link: 'https://gemini.google.com/gem/10IVPkwCsItlUXSdM_gU07FLSaSVgWEd4?usp=sharing' },
    { board: 'IGCSE', grade: '6', link: 'https://gemini.google.com/gem/d03b7048a3c6?usp=sharing' },
    { board: 'IGCSE', grade: '7', link: 'https://gemini.google.com/gem/6dfc0f527414?usp=sharing' },
    { board: 'IGCSE', grade: '8', link: 'https://gemini.google.com/gem/19640d61137c?usp=sharing' },
    { board: 'IGCSE', grade: '9', link: 'https://gemini.google.com/gem/ffafea2ce704?usp=sharing' }
];

async function importGems() {
    console.log(`Starting import of ${data.length} gems...`);
    const dryRun = process.argv.includes('--dry-run');

    if (dryRun) {
        console.log('--- DRY RUN MODE ---');
    }

    for (const entry of data) {
        const id = `${entry.board.toLowerCase().replace(/\s+/g, '-')}-${entry.grade}`;
        const gemName = `TeacherAssist Grade ${entry.grade} (${entry.board})`;

        // Try to fetch pre-generated prompt
        let promptText = '';
        try {
            const promptDoc = await db.collection(PREGENERATED_PROMPTS_COLLECTION).doc(id).get();
            if (promptDoc.exists) {
                promptText = promptDoc.data()?.prompt || '';
            }
        } catch (e) {
            console.warn(`Warning: Could not fetch prompt for ${id}`);
        }

        const gemData = {
            id,
            board: entry.board,
            grade: entry.grade,
            gemName,
            shareLink: entry.link,
            promptText,
            updatedAt: new Date().toISOString()
        };

        if (dryRun) {
            console.log(`[DRY RUN] Would save: ${id} - ${gemName}`);
        } else {
            // Use set with merge to ensure we don't overwrite createdAt if it exists
            const gemRef = db.collection(GEMS_COLLECTION).doc(id);
            const doc = await gemRef.get();

            if (!doc.exists) {
                await gemRef.set({
                    ...gemData,
                    createdAt: new Date().toISOString()
                });
                console.log(`Created: ${id}`);
            } else {
                await gemRef.update(gemData);
                console.log(`Updated: ${id}`);
            }
        }
    }

    console.log('Import complete!');
}

importGems().catch(console.error);
