import { LogoCloud } from "@/components/logo-cloud"; // @efferd/logo-cloud-2
import { DecorIcon } from "@/components/decor-icon";

export function LogosSection() {
  return (
    <section className="mb-12">
      <h2 className="py-6 text-center font-bold font-heading text-lg text-muted-foreground tracking-tight md:text-xl">
        Trusted by <span className="text-foreground">partners</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <LogoCloud />
      </div>
    </section>
  );
}
