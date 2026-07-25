// パスワード認証を画面に出すかどうかの一時的なフラグ。
//
// 本番Supabaseの Confirm email がオフにできておらず（/auth/v1/settings の
// mailer_autoconfirm が false）、パスワードで新規登録すると確認メールの送信に
// 走ってレート制限に当たる。デフォルトSMTPはチームメンバーにしか届かないため、
// 他人が使うと必ず失敗する。それまでGitHubログインのみを見せる。
//
// 本番の mailer_autoconfirm が true になったら、この値を true に戻すだけでよい。
// Server Action (authenticate) とフォームの実装はそのまま残してある。
export const PASSWORD_LOGIN_ENABLED = false;
