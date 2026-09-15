import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
            <SectionTitle
                title="404 — Not Found"
                subtitle="The page you{'\''}re looking for drifted away"
            />
            <p className="text-muted-foreground mt-8 text-center max-w-xl">
                Either this content was moved or you typed something that doesn{'\''}t exist.
            </p>
            <div className="mt-12 flex gap-5">
                <Button variant="primary" as="link" href="/">
                    Back to home
                </Button>
                <Button
                    variant="no-color"
                    as="link"
                    href={`mailto:ryyn.work@gmail.com`}
                    className="border border-border rounded-lg px-6"
                >
                    Report issue
                </Button>
            </div>
        </div>
    );
}
