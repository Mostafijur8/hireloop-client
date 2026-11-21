import type { ReactNode } from "react";

type JobFormSectionProps = {
  title: ReactNode;
  children: ReactNode;
};

/** Standard card and numbered heading shared by job form sections. */
export function JobFormSection({ title, children }: JobFormSectionProps) {
  return (
    <section className="rounded-[12px] border border-[#19191c] bg-[#151515] p-[15px] sm:px-[17px] sm:py-[16px]">
      <h2 className="mb-[14px] flex items-center gap-[7px] text-[14px] font-medium text-[#f0f0f2] lg:text-[17px]">
        <span className="size-[5px] rounded-full bg-[#6555ff]" />
        {title}
      </h2>
      {children}
    </section>
  );
}
