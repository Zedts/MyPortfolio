import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'ryyn.work@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi, I am reaching out to you because...',

    upworkProfile: 'https://www.upwork.com/freelancers/~01d4518f13a97b4f9a?viewMode=1',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/Zedts' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/royyan-hikmal-kautsar-a406332b0/' },
    { name: 'instagram', url: 'https://www.instagram.com/royyan.hk/' },
];

export const MY_STACK = {
    frontend: [
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'Redux',
            icon: '/logo/redux.png',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'Framer Motion',
            icon: '/logo/framer-motion.png',
        },
        {
            name: 'Sass',
            icon: '/logo/sass.png',
        },
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'NestJS',
            icon: '/logo/nest.svg',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'Portfolio',
        slug: 'portfolio',
        liveUrl: 'https://royyan.vercel.app/',
        year: 2026,
        description: `
      Modern and interactive personal portfolio website showcasing my journey as a full-stack developer. Built with cutting-edge technologies to deliver a seamless user experience with smooth animations and responsive design. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Smooth page transitions with Framer Motion</li>
        <li>Advanced scroll-triggered animations using GSAP</li>
        <li>Custom cursor and particle background effects</li>
        <li>Interactive project showcase with detailed case studies</li>
        <li>Fully responsive design optimized for all devices</li>
        <li>Dynamic routing with Next.js App Router</li>
        <li>Optimized performance with server-side rendering</li>
        <li>Sound effects for enhanced user interaction</li>
      </ul>
      `,
        role: `
      Full-Stack Developer & Designer <br/>
      Responsibilities:
      <ul>
        <li>Designed and developed the entire website from concept to deployment</li>
        <li>Implemented complex animations and transitions using GSAP and Framer Motion</li>
        <li>Created reusable React components with TypeScript for type safety</li>
        <li>Optimized website performance achieving 95+ Lighthouse scores</li>
        <li>Designed and implemented responsive layouts using Tailwind CSS</li>
        <li>Integrated custom hooks for audio feedback and scroll progress tracking</li>
        <li>Managed state and routing using Next.js 15 App Router patterns</li>
        <li>Deployed and configured hosting on Vercel with continuous integration</li>
      </ul>
      `,
        techStack: [
            'Next.js',
            'TypeScript',
            'React',
            'Tailwind CSS',
            'GSAP',
            'Framer Motion',
            'Vercel',
        ],
        thumbnail: '/projects/thumbnail/Portfolio.jpg',
        longThumbnail: '/projects/long/Portfolio.jpg',
        images: [
            '/projects/images/Portfolio-1.jpg',
            '/projects/images/Portfolio-2.jpg',
        ],
    },
    {
        title: 'Warung Hub',
        slug: 'warung-hub',
        liveUrl: '-',
        year: 2025,
        description: `
      Digital Marketplace Platform for Indonesian MSMEs. Responsive to all devices (mobile, tablet, desktop). List stores & products, seamless buying and selling. Features: Real-time chat, local payments, KPI Dashboard, role-based access. Tech: Next.js 15+, Tailwind CSS, Node.js/Supabase, PWA. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Digital marketplace for Indonesian MSMEs (UMKM) with multi-role access (admin, seller, buyer)</li>
        <li>Responsive design for mobile, tablet, and desktop devices</li>
        <li>Store registration and product management (CRUD catalog)</li>
        <li>Seamless buying flow from browsing products to checkout</li>
        <li>Real-time chat between buyers and sellers</li>
        <li>Support for local Indonesian payment methods</li>
        <li>KPI Dashboard to monitor store performance and sales</li>
        <li>Built with Next.js 15+, Tailwind CSS, Node.js & Supabase</li>
        <li>PWA support, can be installed like a mobile app</li>
      </ul>
      `,
        role: `
      Full-Stack Developer & Designer <br/>
      Responsibilities:
      <ul>
        <li>Designed and developed the entire website from concept to deployment</li>
        <li>Implemented complex animations and transitions using GSAP and Framer Motion</li>
        <li>Created reusable React components with TypeScript for type safety</li>
        <li>Designed and implemented responsive layouts using Tailwind CSS</li>
        <li>Integrated custom hooks for audio feedback and scroll progress tracking</li>
        <li>Managed state and routing using Next.js 15 App Router patterns</li>
        <li>Deployed and configured hosting on Vercel with continuous integration</li>
      </ul>
      `,
        techStack: [
            'Next.js',
            'TypeScript',
            'React',
            'Tailwind CSS',
            'GSAP',
            'ExpressJS',
            'Supabase',
            'Vercel',
        ],
        thumbnail: '/projects/thumbnail/WarungHub.png',
        longThumbnail: '/projects/long/WarungHub.png',
        images: [
            '/projects/images/WarungHub-1.png',
            '/projects/images/WarungHub-2.png',
        ],
    },
    {
        title: 'Dimsum',
        slug: 'dimsum',
        liveUrl: '-',
        year: 2025,
        description: `
      Dimsum is a modern frozen food e-commerce website I built for my own home-based dimsum business. It lets customers browse the menu, select dimsum varieties, and place orders online easily, built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, and Supabase for a fast and responsive experience across all devices. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Online dimsum ordering for home-based frozen food business</li>
        <li>Menu browsing with product selection and order placement</li>
        <li>Responsive design for mobile, tablet, and desktop devices</li>
        <li>Admin dashboard for managing orders and inventory</li>
        <li>Settings page for business configuration</li>
        <li>Built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI</li>
        <li>Supabase integration for database and authentication</li>
        <li>Modern and fast e-commerce experience for frozen food</li>
      </ul>
      `,
        role: `
      Full-Stack Developer & Designer <br/>
      Responsibilities:
      <ul>
        <li>Designed and developed the entire website from concept to deployment</li>
        <li>Implemented complex animations and transitions using GSAP and Framer Motion</li>
        <li>Created reusable React components with TypeScript for type safety</li>
        <li>Designed and implemented responsive layouts using Tailwind CSS</li>
        <li>Integrated custom hooks for audio feedback and scroll progress tracking</li>
        <li>Managed state and routing using Next.js 15 App Router patterns</li>
        <li>Deployed and configured hosting on Vercel with continuous integration</li>
      </ul>
      `,
        techStack: [
            'Next.js',
            'TypeScript',
            'React',
            'Tailwind CSS',
            'GSAP',
            'ShadcnUI',
            'Prisma',
            'Supabase',
            'Vercel',
        ],
        thumbnail: '/projects/thumbnail/Dimsum.png',
        longThumbnail: '/projects/long/Dimsum.png',
        images: [
            '/projects/images/Dimsum-1.png',
            '/projects/images/Dimsum-2.png',
        ],
    },
    {
        title: 'Factory Dashboard',
        slug: 'factory-dashboard',
        liveUrl: '-',
        year: 2025,
        description: `
      Factory dashboard created based on the tasks given during PKL at Denso in order to facilitate digitalization related to the KPI monitoring system for safety from various divisions used for meeting purposes <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Centralized factory performance dashboard with multiple views (Safety, Quality, Delivery, etc.)</li>
        <li>Config-driven layout using reusable base components for consistency</li>
        <li>Dynamic period selection (daily, weekly, monthly) across all dashboards</li>
        <li>Support for multiple company codes via configurable settings</li>
        <li>Interactive charts and KPIs to monitor factory metrics in real time</li>
        <li>Responsive UI optimized for large screens and factory display panels</li>
        <li>Built with React + TypeScript and Vite for fast, maintainable frontend</li>
      </ul>
      `,
        role: `
      Front-End Developer & Designer <br/>
      Responsibilities:
      <ul>
        <li>Designed and developed the entire website UI from mock-up</li>
        <li>Created reusable React components with TypeScript for type safety</li>
        <li>Designed and implemented responsive layouts using Tailwind CSS</li>
        <li>Little bit helping the Back-End section a little because something is urgent and needs to be reviewed quickly by the client. </li>
      </ul>
      `,
        techStack: [
            'TypeScript',
            'React',
            'Tailwind CSS',
            'Postman API',
            'NodeJS',
            'MsSql',
        ],
        thumbnail: '/projects/thumbnail/FactoryDashboard.png',
        longThumbnail: '/projects/long/FactoryDashboard.png',
        images: [
            '/projects/images/Factory-1.png',
            '/projects/images/Factory-2.png',
        ],
    },
    {
        title: 'Mizusumashi Surfers',
        slug: 'mizusumashi-surfers',
        liveUrl: '-',
        year: 2025,
        description: `
      Mizusumashi surfers is an Android application developed using React Native, where this application functions as a mediator or refinement tool related to the previously manual process of inputting stock items to be sent to the warehouse to be automated by using the scan feature. <br/> <br/>
      
      Key Features:<br/>
      <ul>
        <li>Scan Feature untuk mengautomasi input item stock yang sebelumnya manual</li>
        <li>Automasi proses input stock items yang akan dikirim ke warehouse</li>
        <li>Berfungsi sebagai mediator/refinement tool untuk memperbaiki proses input stock</li>
        <li>Aplikasi Android khusus untuk manajemen inventory warehouse</li>
        <li>Dibangun menggunakan framework React Native</li>
        <li>Barcode/QR Code scanning untuk item stock</li>
        <li>Real-time tracking status stock item</li>
        <li>Integrasi dengan sistem warehouse</li>
        <li>Data validation untuk mengurangi error input manual</li>
        <li>History logging dan reporting untuk tracking input stock</li>
      </ul>
      `,
        role: `
      Full-Stack Developer & Designer <br/>
      Responsibilities:
      <ul>
        <li>Designed and developed the entire apps UI from scratch from business requirements</li>
        <li>Created reusable React components with TypeScript for type safety</li>
        <li>Designed and implemented responsive layouts using Tailwind CSS</li>
        <li>Managed state and routing using react native Router patterns</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'TypeScript',
            'Kotlin',
            'Postman API',
            'MsSql',
            'NodeJS',
        ],
        thumbnail: '/projects/thumbnail/Mizusumashi.png',
        longThumbnail: '/projects/long/Mizusumashi.png',
        images: [
            '/projects/images/Mizusumashi-1.jpg',
            '/projects/images/Mizusumashi-2.jpg',
        ],
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'Intern Software Engineer',
        company: 'PT Denso Indonesia',
        duration: 'July 2025 - February 2026',
        description:
            'Engineered and optimized internal web applications using React and Node.js. Improved system efficiency by 20% through database query optimization and implemented responsive UI components for manufacturing dashboards.',
    },
    {
        title: 'Usher',
        company: 'Big Bang Festival',
        duration: 'December 2025 - January 2026',
        description:
            'Managed crowd control and guest relations for a high-traffic festival. Coordinated with security and logistics teams to ensure seamless entry for over 5,000 daily attendees while maintaining high service standards.',
    },
    {
        title: 'Crew Runner',
        company: 'Manufacturing Expo',
        duration: 'December 3 - December 6 (2025)',
        description:
            'Facilitated logistical operations for international exhibitors. Managed equipment distribution and provided real-time support for technical setups, ensuring all booth requirements were met ahead of schedule.',
    },
];
