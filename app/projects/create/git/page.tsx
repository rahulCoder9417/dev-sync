"use client"
import { handleConnect } from '@/lib/mainUtils/gitLogin'
import { useAppSelector } from '@/lib/redux/hooks'
import React from 'react'
const page = () => {
  const isGit = useAppSelector((state)=> state.user.githubUrl)
  if(!isGit || isGit.length===0){
    handleConnect()
    return
  }else{
  return (
    <div>page</div>
  )}
}

export default page