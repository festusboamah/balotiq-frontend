import { InfiniteSlider } from "@/components/infinite-slider";

type Logo = {
  src: string;
  alt: string;
};

const logos: Logo[] = [
  { src: "/logos/dambai-college-of-education.png", alt: "Dambai College of Education" },
  { src: "/logos/peki-college-of-education.jpg", alt: "Peki College of Education" },
  { src: "/logos/st-francis-college-of-education.jpg", alt: "St. Francis College of Education" },
  { src: "/logos/ghana-national-association-of-teachers.jpg", alt: "Ghana National Association of Teachers" },
  { src: "/logos/teachers-weekly-insider.jpg", alt: "Teachers Weekly Insider" },
  { src: "/logos/stars-awards.jpg", alt: "Stars Awards" },
  { src: "/logos/233-awards.svg", alt: "233 Awards" },
  { src: "/logos/233-events.svg", alt: "233 Events" },
  { src: "/logos/volta-campus-icons.svg", alt: "Volta Campus Icons" },
  { src: "/logos/volta-impact-awards.svg", alt: "Volta Impact Awards" },
  { src: "/logos/nerds-iv-technologies.jpg", alt: "Nerds IV Technologies" },
];

export function LogoCloud() {
  return (
    <div className="py-4">
      <InfiniteSlider
        className="mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        gap={16}
        speed={40}
        speedOnHover={15}
      >
        {logos.map(logo => (
          <div
            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white p-4"
            key={logo.alt}
          >
            <img
              alt={logo.alt}
              className="pointer-events-none max-h-14 w-auto max-w-full select-none object-contain"
              src={logo.src}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
