import { SoundLink } from '@/components/ui/SoundLink';
import FooterCopyright from '@/components/admin/FooterCopyright';
import { getSettings } from '@/lib/services/settings-service';

interface RepoStats {
    stargazers_count: number;
    forks_count: number;
}

const DEFAULT_EMAIL = 'ryyn.work@gmail.com';
const DEFAULT_NAME = 'Royyan Hikmal Kautsar';

const Footer = async () => {
    let stats: RepoStats = { stargazers_count: 0, forks_count: 0 };

    const GITHUB_REPO = 'Zedts/MyPortfolio';

    const settings = await getSettings();
    const email = settings?.email || DEFAULT_EMAIL;
    const name = settings?.name || DEFAULT_NAME;

    try {
        const repoStats = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}`,
            {
                next: {
                    revalidate: 3600,
                },
            },
        );

        if (repoStats.ok) {
            const data = await repoStats.json();
            stats = data as RepoStats;
        }
    } catch {
        // Silently skip if GitHub API is unavailable
    }

    return (
        <footer className="text-center pb-10 mt-20" id="contact">
            <div className="container">
                <p className="text-lg text-muted-foreground">Have a project in mind?</p>
                <SoundLink
                    href={`mailto:${email}`}
                    className="text-3xl sm:text-5xl font-anton inline-block mt-5 mb-10 hover:text-primary transition-colors underline decoration-primary underline-offset-8"
                >
                    {email}
                </SoundLink>
                
                <div className="flex justify-center gap-8 text-sm text-muted-foreground mt-10">
                    <FooterCopyright year={new Date().getFullYear().toString()} name={name} />
                    {stats.stargazers_count > 0 && (
                        <div className="flex gap-4">
                            <span>⭐ {stats.stargazers_count}</span>
                            <span>🍴 {stats.forks_count}</span>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
