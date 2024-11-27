import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white font-bold">H</span>
      </div>
     
    </Link>
  );
} 