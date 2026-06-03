import { GENERAL_INFO } from '@/lib/data';

interface RepoStats {
    stargazers_count: number;
    forks_count: number;
}

const Footer = async () => {
    let stats: RepoStats = { stargazers_count: 0, forks_count: 0 };
    
    // Placeholder for your GitHub repository stats
    // Replace 'your-username/your-repo' with your actual repository path
    const GITHUB_REPO = 'your-username/your-repo'; 

    try {
        if (GITHUB_REPO !== 'your-username/your-repo') {
            const repoStats = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}`,
                {
                    next: {
                        revalidate: 3600, // 1 hour
                    },
                },
            );

            if (repoStats.ok) {
                const data = await repoStats.json();
                stats = data as RepoStats;
            }
        }
    } catch (error) {
        console.error('Failed to fetch repo stats:', error);
    }

    return (
        <footer className="text-center pb-10 mt-20" id="contact">
            <div className="container">
                <p className="text-lg text-muted-foreground">Have a project in mind?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-3xl sm:text-5xl font-anton inline-block mt-5 mb-10 hover:text-primary transition-colors underline decoration-primary underline-offset-8"
                >
                    {GENERAL_INFO.email}
                </a>
                
                <div className="flex justify-center gap-8 text-sm text-muted-foreground mt-10">
                    <p>© {new Date().getFullYear()} Your Name</p>
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
