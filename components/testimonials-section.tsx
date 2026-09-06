"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Testimonial = {
  quote: string;
  image: string;
  name: string;
  role: string;
  company?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Efferd is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
    image: "https://github.com/shadcn.png",
    name: "Shadcn",
    role: "Founder",
    company: "Shadcn UI",
  },
  {
    quote:
      "Efferd is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
    image: "https://github.com/rauchg.png",
    name: "Guillermo Rauch",
    role: "CEO",
    company: "Vercel",
  },
  {
    quote:
      "I tried to buy Efferd but they wouldn't sell. So I just bought Twitter instead to complain about it.",
    image: "https://unavatar.io/x/elonmusk",
    name: "Elon Musk",
    role: "CEO",
    company: "X.com",
  },
  {
    quote:
      "We just acquired Efferd for 3 gazillion dollars. We're calling it iEfferd. It's our best product yet.",
    image: "https://unavatar.io/x/tim_cook",
    name: "Tim Cook",
    role: "CEO",
    company: "Apple",
  },
  {
    quote:
      "I'm considering shipping Efferd components with Prime delivery. 2-day shipping on beautiful UIs? Done.",
    image: "https://unavatar.io/x/JeffBezos",
    name: "Jeff Bezos",
    role: "Founder",
    company: "Amazon",
  },
  {
    quote:
      "We're rewriting OpenAI's entire frontend in Efferd. The AGI told us it's the only logical choice.",
    image: "https://unavatar.io/x/sama",
    name: "Sam Altman",
    role: "CEO",
    company: "OpenAI",
  },
  {
    quote:
      "We processed 100 petabytes of data to find the perfect UI library. The algorithm returned 'Efferd' with 99.9% confidence.",
    image: "https://unavatar.io/x/sundarpichai",
    name: "Sundar Pichai",
    role: "CEO",
    company: "Google",
  },
  {
    quote:
      "Our links might 404 sometimes, but thanks to Efferd, at least the 404 page looks absolutely stunning.",
    image: "https://github.com/steven-tey.png",
    name: "Steven Tey",
    role: "Founder",
    company: "Dub.co",
  },
  {
    quote:
      "It's so fast, I finished my UI sprint before my next meeting even started. Open source for the win.",
    image: "https://unavatar.io/x/peer_rich",
    name: "Peer Richelsen",
    role: "Co-Founder",
    company: "Cal.com",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-muted px-4 py-24 md:px-8 md:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-background/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Testimonials
            </span>

            {/* Heading */}
            <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Trusted by people
              <br className="hidden md:block" />
              <span className="text-primary"> who value better elections.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-foreground/65 md:text-lg">
              See why organisations choose Balotiq to run secure, transparent,
              and trustworthy elections from setup to certification.
            </p>
          </motion.div>
        </div>

        {/* Testimonials */}
        <div
          className={cn(
            "relative mx-auto mt-20 flex max-h-160 max-w-5xl justify-center gap-6 overflow-hidden",
            "mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
          )}
        >
          <InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
            {firstColumn.map(testimonial => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>

          <InfiniteSlider
            className="hidden md:block"
            direction="vertical"
            speed={50}
            speedOnHover={25}
          >
            {secondColumn.map(testimonial => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>

          <InfiniteSlider
            className="hidden lg:block"
            direction="vertical"
            speed={35}
            speedOnHover={17}
          >
            {thirdColumn.map(testimonial => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCard({
  testimonial,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
}) {
  const { quote, image, name, role, company } = testimonial;

  return (
    <figure
      className={cn(
        "w-full max-w-xs rounded-3xl border border-foreground/10 bg-background/80 p-8 text-foreground shadow-lg shadow-foreground/10 backdrop-blur-sm",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-foreground/15",
        className,
      )}
      {...props}
    >
      <blockquote className="leading-7 text-foreground/85">
        “{quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar className="size-9 rounded-full border border-primary/20">
          <AvatarImage alt={`${name}'s profile picture`} src={image} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <cite className="font-medium not-italic leading-5 tracking-tight text-foreground">
            {name}
          </cite>

          <span className="text-sm leading-5 tracking-tight text-foreground/55">
            {role} {company && `, ${company}`}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
