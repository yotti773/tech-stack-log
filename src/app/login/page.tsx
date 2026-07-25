import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 px-8 py-32">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          ログイン
        </h1>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          メールアドレス宛にログインリンクを送ります。
        </p>

        <LoginForm confirmError={error} />
      </main>
    </div>
  );
}
