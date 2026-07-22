import AppSidebar from "@/components/layout/AppSidebar";
import Conversation from "@/components/chat/Conversation";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";

export default function ConversationPage() {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <AppSidebar />

        <main className="min-w-0 flex-1 py-4 md:py-8">
          <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-[28px] border border-memo-divider bg-memo-surface">
            <ConversationSidebar />
            <Conversation />
          </div>
        </main>
      </div>
    </div>
  );
}