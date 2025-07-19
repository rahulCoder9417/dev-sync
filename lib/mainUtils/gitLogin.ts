export const handleConnect = () => {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
  const redirectUri = `${window.location.origin}/api/auth/github/callback`

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`

  window.location.href = url
}