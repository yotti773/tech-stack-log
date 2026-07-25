import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 px-8 py-32">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          ログイン
        </h1>
        <p className="text-center text-sm text-dim">
          メールアドレス宛にログインリンクを送ります。
        </p>

        <LoginForm confirmError={error} />
      </main>
    </div>
  );
}
