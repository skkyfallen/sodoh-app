import { getContactSubmissions } from "@/lib/data-admin";
import MessagesManager from "@/components/admin/MessagesManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function MessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <>
      <PageHeader
        title="Messages"
        description="Contact form submissions from the public site."
      />

      <MessagesManager initialMessages={submissions} />
    </>
  );
}
