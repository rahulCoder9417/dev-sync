// app/api/download-repo/route.js
import { NextResponse } from 'next/server';
import { Octokit } from "@octokit/core";

export async function GET(request :any) {
  const { searchParams } = new URL(request.url);
  const userAuth = searchParams.get('auth'); // e.g. /api/download-repo?auth=ghp_123abc...

  if (!userAuth) {
    return NextResponse.json({ error: 'Missing GitHub auth token' }, { status: 400 });
  }

  const octokit = new Octokit({ auth: userAuth });

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/zipball', {
      owner: 'chaiaurcode',
      repo: 'chai-backend',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const downloadUrl = response.url;

    // Option 1: Redirect to GitHub's zipball URL
    return NextResponse.redirect(downloadUrl);

    // Option 2: Stream zipball through your server (advanced)
    // fetch and stream file from downloadUrl, pipe it into NextResponse
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'GitHub request failed', details: error },
      { status: 500 }
    );
  }
}
