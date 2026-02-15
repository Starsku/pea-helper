"use client";

import AuthBar from "@/components/AuthBar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mx-auto">
          <AuthBar />
        </div>
      </div>
    </main>
  );
}
