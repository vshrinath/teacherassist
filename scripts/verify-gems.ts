import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();
const GEMS_COLLECTION = 'gems';

async function verify() {
    const snapshot = await db.collection(GEMS_COLLECTION).get();
    console.log(`Total Gems in Firestore: ${snapshot.size}`);

    // Check specific entries
    const checkIds = ['cbse-1', 'icse-12', 'igcse-5', 'igcse-9'];
    for (const id of checkIds) {
        const doc = await db.collection(GEMS_COLLECTION).doc(id).get();
        if (doc.exists) {
            console.log(`Verified: ${id} exists with name: ${doc.data()?.gemName}`);
            if (id === 'igcse-5') {
                console.log(`IGCSE-5 Link: ${doc.data()?.shareLink}`);
            }
        } else {
            console.log(`FAILED: ${id} does not exist`);
        }
    }
}

verify().catch(console.error);
