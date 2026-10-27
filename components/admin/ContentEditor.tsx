"use client";

import CMSEditor from "@/components/admin/CMSEditor";

type SectionMap = Record<string, Record<string, unknown>>;

type Props = {
  pages: Record<string, SectionMap>;
};

/** Keep the legacy editor entry point aligned with the public-field CMS editor. */
export default function ContentEditor({ pages }: Props) {
  return <CMSEditor pages={pages} />;
}
