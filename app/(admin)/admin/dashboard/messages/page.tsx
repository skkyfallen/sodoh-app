import { getContactSubmissions } from "@/lib/data";
import MessagesManager from "@/components/admin/MessagesManager";

export default async function MessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Messages</h1>
      <p className="text-slate-500 text-sm mb-8">
        Contact form submissions from the public site.
      </p>

      <MessagesManager initialMessages={submissions} />
    </>
  );
}
