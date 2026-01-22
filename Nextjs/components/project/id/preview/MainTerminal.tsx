import React from 'react'
import ServerTerminalProps, { ServerTerminalProps as ServerTerminalPropsType } from './ServerTerminalProps'
import { useAppSelector } from '@/lib/redux/hooks'
import BrowserTerminal from './BrowserTerminal'


const MainTerminal = ({projectId,terminalLoaded,setTerminalLoaded,projectName}:ServerTerminalPropsType) => {
    const type = useAppSelector((state)=>state.terminalOptions.terminalOptions[projectId])
  return (
    <div className='w-full h-full flex items-center justify-center bg-secondary'>
    { 
     type === "server" ?
      <ServerTerminalProps projectId={projectId} terminalLoaded={terminalLoaded} setTerminalLoaded={setTerminalLoaded} projectName={projectName}/>
       : type === "client" ? <BrowserTerminal />
       :<></> 
    }
    </div>
  )
}

export default MainTerminal
