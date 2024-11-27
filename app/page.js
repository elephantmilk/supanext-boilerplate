import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Willkommen bei Heritaxa
        </h1>
        <p className="text-xl text-muted-foreground">
          Lassen Sie uns gemeinsam Ihr Profil erstellen
        </p>
        <Button asChild size="lg">
          <Link href="/onboarding">
            Profil erstellen
          </Link>
        </Button>
      </div>
    </main>
  );
}
