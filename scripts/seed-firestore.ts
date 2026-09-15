import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { loadEnvConfig } from '@next/env';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectDir = join(__dirname, '..');
loadEnvConfig(projectDir);

import { STACK_ITEMS_FLAT } from '../lib/data/stack';
import { MY_EXPERIENCE } from '../lib/data/experience';
import { PROJECTS } from '../lib/data/projects';
import { SOCIAL_LINKS } from '../lib/data/social';
import {
    GENERAL_INFO,
    BANNER_STATS,
    ABOUT_ME_TEXT,
    BANNER_TEXT,
} from '../lib/data/settings';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

const APP_NAME = 'seed-script';

function getAdminApp() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in .env.local',
        );
    }

    const existing = getApps().find((a) => a.name === APP_NAME) ?? getApps()[0];
    if (existing) return existing;

    return initializeApp(
        {
            credential: cert({ projectId, clientEmail, privateKey }),
            projectId,
        },
        APP_NAME,
    );
}

async function seed() {
    const app = getAdminApp();
    const db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });

    let totalCreated = 0;
    let totalUpdated = 0;

    const cleanData = (obj: Record<string, unknown>) => {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj)) {
            if (v === undefined) continue;
            out[k] = v;
        }
        return out;
    };

    console.log('Seeding: settings/site ...');
    {
        const ref = db.collection('settings').doc('site');
        const doc = await ref.get();
        const data = cleanData({
            email: GENERAL_INFO.email,
            emailSubject: GENERAL_INFO.emailSubject,
            emailBody: GENERAL_INFO.emailBody,
            upworkProfile: GENERAL_INFO.upworkProfile,
            socialLinks: SOCIAL_LINKS,
            bannerStats: BANNER_STATS,
            aboutMeText: ABOUT_ME_TEXT,
            bannerText: BANNER_TEXT,
            lastModifiedAt: FieldValue.serverTimestamp(),
        });
        if (doc.exists) {
            await ref.update(data);
            totalUpdated++;
        } else {
            await ref.set(data);
            totalCreated++;
        }
        console.log(`  ✓ settings/site ${doc.exists ? 'updated' : 'created'}`);
    }

    console.log(`Seeding: stack (${STACK_ITEMS_FLAT.length} items) ...`);
    {
        const batch = db.batch();
        for (const item of STACK_ITEMS_FLAT) {
            const id = slugify(item.name);
            batch.set(db.collection('stack').doc(id), cleanData(item as unknown as Record<string, unknown>), { merge: true });
            totalCreated++;
        }
        await batch.commit();
        console.log(`  ✓ stack: ${STACK_ITEMS_FLAT.length} items upserted`);
    }

    console.log(`Seeding: experiences (${MY_EXPERIENCE.length} items) ...`);
    {
        const batch = db.batch();
        for (const exp of MY_EXPERIENCE) {
            const id = slugify(`${exp.company}-${exp.title}`);
            batch.set(db.collection('experiences').doc(id), cleanData(exp as unknown as Record<string, unknown>), { merge: true });
            totalCreated++;
        }
        await batch.commit();
        console.log(`  ✓ experiences: ${MY_EXPERIENCE.length} items upserted`);
    }

    console.log(`Seeding: projects (${PROJECTS.length} items) ...`);
    {
        const batch = db.batch();
        for (const proj of PROJECTS) {
            const id = proj.slug;
            batch.set(db.collection('projects').doc(id), cleanData(proj as unknown as Record<string, unknown>), { merge: true });
            totalCreated++;
        }
        await batch.commit();
        console.log(`  ✓ projects: ${PROJECTS.length} items upserted`);
    }

    console.log('\n✅ Seed complete!');
    console.log(`   Total created (upsert): ${totalCreated}`);
    console.log(`   Total updated: ${totalUpdated}`);
    console.log('\nVerify in Firebase Console → Firestore Database.');
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
