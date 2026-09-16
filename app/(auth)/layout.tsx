import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

const AuthLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="relative w-full min-w-0 md:h-screen md:overflow-hidden">
      <div className="relative mx-auto flex min-h-screen w-full min-w-0 max-w-5xl flex-col justify-center px-8">
        <Button
          className="absolute top-4 left-4"
          variant="ghost"
          render={<Link href="/" />}
          nativeButton={false}
        >
          <ArrowLeftIcon data-icon="inline-start" /> Back to home
        </Button>
        <Particles
          className="absolute inset-0"
          color="#666666"
          ease={20}
          quantity={120}
        />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
