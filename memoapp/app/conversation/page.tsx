import AppSidebar from "@/components/layout/AppSidebar";
import Conversation from "@/components/chat/Conversation";

export default function ConversationPage() {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <AppSidebar />

        <main className="min-w-0 flex-1 py-4 md:py-8">
          <Conversation />
        </main>
      </div>
    </div>
  );
}