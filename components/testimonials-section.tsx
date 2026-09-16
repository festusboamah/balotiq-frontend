"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Testimonial = {
  quote: string;
  image?: string;
  name: string;
  role: string;
  company?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Balotiq has given us much greater confidence in the integrity of our elections. The combination of private ballots and a complete audit trail means we can run the process efficiently while still being able to explain and verify the result.",
    name: "Dr. Kwame Mensah",
    role: "Head of Institution",
    company: "Dambai College of Education",
  },
  {
    quote:
      "What impressed us most was how much of the election process could be handled in one place. From preparing the voter roll to scheduling the election and certifying the results, Balotiq has reduced the amount of manual work required from our team.",
    name: "Mrs. Ama Boateng",
    role: "Principal",
    company: "Peki College of Education",
  },
  {
    quote:
      "The audit trail is particularly valuable to us. We have a permanent record of important administrative actions, which makes the election process easier to review and gives stakeholders greater confidence in the final outcome.",
    name: "Dr. Daniel Asare",
    role: "Election Coordinator",
    company: "St. Francis College of Education",
  },
  {
    quote:
      "For public voting campaigns, the operational controls are just as important as the voting experience. Balotiq gives us visibility into revenue, payment reconciliation, and campaign performance without making the process unnecessarily complicated.",
    name: "Michael Owusu",
    role: "Event Director",
    company: "233 Events",
  },
  {
    quote:
      "Balotiq gives our awards campaigns a much stronger foundation. Voters get a straightforward experience, while our team can manage contestants, vote packages, payments, and the final results from a single platform.",
    name: "Nana Adjei",
    role: "Organising Director",
    company: "233 Awards",
  },
  {
    quote:
      "The reconciliation workflow has been one of the biggest improvements for our team. We can identify payments that need attention, resolve them with a clear audit trail, and maintain a reliable record throughout the campaign.",
    name: "Linda Asante",
    role: "Campaign Manager",
    company: "Volta Impact Awards",
  },
  {
    quote:
      "When people are voting, they need to trust that their vote is private and that the final result can be accounted for. Balotiq addresses both sides of that equation and gives administrators the tools to manage the process with confidence.",
    name: "Joseph Kofi Mensah",
    role: "Programme Director",
    company: "Teachers Weekly Insider",
  },
  {
    quote:
      "The platform gives our team a much clearer view of what is happening during an active campaign. Being able to monitor participation and keep the financial side organised has made our events easier to manage.",
    name: "Esther Agyeman",
    role: "Operations Lead",
    company: "Volta Campus Icons",
  },
  {
    quote:
      "Balotiq brings structure to what can otherwise become a very difficult process to manage manually. The ability to review, certify, and export the results gives us a clear record that we can stand behind.",
    name: "Samuel Addo",
    role: "Election Manager",
    company: "GNAT",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-muted px-4 py-24 md:px-8 md:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-background/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Tag */}
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Testimonials
          </span>

          {/* Heading */}
          <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Trusted by leaders who
            <br className="hidden md:block" />
            <span className="text-primary">
              {" "}
              take election integrity seriously.
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-foreground/65 md:text-lg">
            From institutional elections to public voting campaigns, leaders use
            Balotiq to make every vote secure, verifiable, and accountable.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <TestimonialsCard
              key={`${testimonial.name}-${testimonial.company}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
        "flex h-full min-w-0 flex-col rounded-3xl border border-foreground/10 bg-background/80 p-6 text-foreground shadow-lg shadow-foreground/10 backdrop-blur-sm sm:p-8",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-foreground/15",
        className,
      )}
      {...props}
    >
      {/* Quote mark */}
      <div className="mb-5 font-heading text-5xl leading-none text-primary/25">
        “
      </div>

      <blockquote className="min-w-0 flex-1 wrap-break-word text-sm leading-7 text-foreground/85 md:text-base">
        {quote}
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-border/60 pt-5">
        <Avatar className="size-10 shrink-0 rounded-full border border-primary/20">
          {image && (
            <AvatarImage alt={`${name}'s profile picture`} src={image} />
          )}

          <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <cite className="block truncate font-medium not-italic leading-5 tracking-tight text-foreground">
            {name}
          </cite>

          <span className="block text-xs leading-5 text-muted-foreground">
            {role}
          </span>

          {company && (
            <span className="block truncate text-xs font-medium leading-5 text-primary">
              {company}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
