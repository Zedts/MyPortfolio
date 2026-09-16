export interface ISocialLink {
    name: string;
    url: string;
}

export interface IBannerStats {
    years: string;
    projects: string;
    users: string;
}

export interface ISiteSettings {
    email: string;
    emailSubject: string;
    emailBody: string;
    upworkProfile: string;
    socialLinks: ISocialLink[];
    bannerStats?: IBannerStats;
    aboutMeText?: string;
    aboutMeTitle?: string;
    bannerText?: string;
    name?: string;
    role?: string;
}
