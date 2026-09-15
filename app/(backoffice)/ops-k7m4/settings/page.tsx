import SectionTitle from '@/components/common/SectionTitle';
import AdminPageHeader from '../_components/AdminPageHeader';
import SettingsClient from './_components/SettingsClient';
import { getSettings } from '@/lib/services/settings-service';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getSettings();
    return (
        <div>
            <SectionTitle title="Settings" />
            <AdminPageHeader breadcrumb={[{ label: 'Admin Ops', href: '/ops-k7m4' }, { label: 'Settings' }]} />
            <SettingsClient initialSettings={settings} />
        </div>
    );
}
