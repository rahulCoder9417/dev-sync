'use client'
import { Octokit } from "@octokit/core";
import { showToast } from '@/components/main/Toast'
import { handleConnect } from '@/lib/mainUtils/gitLogin'
import { useAppSelector } from '@/lib/redux/hooks'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const user = useAppSelector((state) => state.user)
  useEffect(() => {
    if ((!user.githubUrl || user.githubUrl.length === 0) && user.isAuthenticated) {
      console.log("No GitHub connected, calling connect handler")
      showToast(true, "You are redirected to dashboard", "This happened because you were not authenticated via git ,if this is persisting try later")

      handleConnect()
    }
  }, [user.isAuthenticated])

  if (!user.isAuthenticated) return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      <p className='text-3xl text-primary font-bold'>Wait git Hub verifaction is going on ......</p>
    </div>
  )
  const handleCloneRepo = async () => {

    const res = await fetch('/api/git/clonePublicRepo?auth='+user.githubUrl);

    if (res.redirected) {
      window.location.href = res.url; // triggers actual download from GitHub
    } else {
      const err = await res.json();
      console.error('Error:', err);
    }

  }
  const commitFile = async (filePath: string, content: string) => {
    await fetch('/api/github/commit', {
      method: 'POST',
      body: JSON.stringify({ filePath, content }),
      headers: { 'Content-Type': 'application/json' }
    })
  }


  return (
    <div className='min-h-screen w-full bg-primary flex items-center justify-center'>
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl text-white mb-4">Choose Action</h2>
        <button onClick={handleCloneRepo} className="bg-brand-primary px-4 py-2 rounded text-white mb-3">Clone Public Repo</button>
        {/* <button onClick={handleEditOwnRepo} className="bg-brand-accent px-4 py-2 rounded text-white">Edit Own Repo</button> */}
      </div>
    </div>
  )
}

export default Page
