import { LoginForm } from "./login-form";
import { PASSWORD_LOGIN_ENABLED } from "./config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 px-8 py-32">
        <h1 className="font-display text-3xl tracking-wide text-text">
          ログイン
        </h1>
        <p className="text-center text-sm text-dim">
          {PASSWORD_LOGIN_ENABLED
            ? "GitHubアカウント、またはメールアドレスとパスワードでログインします。"
            : "GitHubアカウントでログインします。"}
        </p>

        <LoginForm confirmError={error} />
      </main>
    </div>
  );
}
