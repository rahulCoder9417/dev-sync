import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-primary">


      <main className="flex-1 flex justify-center items-center p-6">
        <SignInForm />
      </main>

      {/* Dark mode footer */}
      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; Dec-sync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}