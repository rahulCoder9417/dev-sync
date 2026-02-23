import { IconType } from 'react-icons';
import React from 'react';
import {  FaJava,
  FaPhp,
  FaRust,
  FaGit,
  FaCuttlefish,  
  FaCodeBranch,   
  FaLinux,
  FaGem,
  FaFile, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt,
  FaFileExcel, FaFileCode, FaFileArchive, FaFileVideo, FaFileAudio,
  FaReact, FaNodeJs, FaGitAlt, FaJs, FaCss3Alt, FaHtml5, FaMarkdown,
  FaNpm, FaDocker, FaPython, FaFileCsv, FaFileContract,
} from 'react-icons/fa';
import {  SiCplusplus,
  SiGo,
  SiRuby,
  SiBabel,
  SiEslint,
  SiPrettier,
  SiDocker,
  SiLua,
  SiSvelte,
  SiAstro, SiTypescript, SiNextdotjs, SiJson, SiYaml, SiVite, SiTailwindcss } from 'react-icons/si';
import { Folder } from 'lucide-react';

type IconInfo = {
  icon: IconType;
  color: string;
};

const exactFileNameMap: Record<string, IconInfo> = {
  'babelrc': { icon: SiBabel, color: '#f9dc3e' },
'eslintrc': { icon: SiEslint, color: '#4b32c3' },
'prettierrc': { icon: SiPrettier, color: '#f7b93e' },
'dockerfile': { icon: SiDocker, color: '#0db7ed' },
'svelte': { icon: SiSvelte, color: '#ff3e00' },
'astro': { icon: SiAstro, color: '#ff5d01' },
  'package.json': { icon: FaNpm, color: '#cc3534' },
  'next.config.js': { icon: SiNextdotjs, color: 'black' },
  'vite.config.js': { icon: SiVite, color: '#646cff' },
  'tailwind.config.js': { icon: SiTailwindcss, color: '#06b6d4' },
  'docker-compose.yml': { icon: FaDocker, color: '#0db7ed' },
  '.gitignore': { icon: FaGitAlt, color: '#f1502f' },
  'README.md': { icon: FaMarkdown, color: '#333' },
  '.env': { icon: FaFileContract, color: '#4a4a4a' },
};

const extensionToIconMap: Record<string, IconInfo> = {
  c: { icon: FaCuttlefish, color: '#555' },
cpp: { icon: SiCplusplus, color: '#f34b7d' },
java: { icon: FaJava, color: '#007396' },
go: { icon: SiGo, color: '#00add8' },
rs: { icon: FaRust, color: '#dea584' },
php: { icon: FaPhp, color: '#8892be' },
rb: { icon: FaGem, color: '#701516' },
sh: { icon: FaLinux, color: '#000' },
bash: { icon: FaLinux, color: '#000' },
lua: { icon: SiLua, color: '#000080' },
  js: { icon: FaJs, color: '#f7df1e' },
  jsx: { icon: FaReact, color: '#61dafb' },
  ts: { icon: SiTypescript, color: '#3178c6' },
  tsx: { icon: FaReact, color: '#61dafb' },
  html: { icon: FaHtml5, color: '#e34c26' },
  css: { icon: FaCss3Alt, color: '#264de4' },
  json: { icon: SiJson, color: '#cbcb41' },
  yml: { icon: SiYaml, color: '#cbcb41' },
  yaml: { icon: SiYaml, color: '#cbcb41' },
  py: { icon: FaPython, color: '#3572A5' },
  env: { icon: FaFileContract, color: '#4a4a4a' },
  md: { icon: FaMarkdown, color: '#333' },
  txt: { icon: FaFileAlt, color: '#555' },
  pdf: { icon: FaFilePdf, color: 'red' },
  xls: { icon: FaFileExcel, color: 'green' },
  csv: { icon: FaFileCsv, color: '#36a2eb' },
  mp4: { icon: FaFileVideo, color: '#a428a2' },
  folder:{icon:Folder ,color:'blue'},
  mp3: { icon: FaFileAudio, color: '#2b8a3e' },
  png: { icon: FaFileImage, color: 'orange' },
  jpg: { icon: FaFileImage, color: 'orange' },
  jpeg: { icon: FaFileImage, color: 'orange' },
  gif: { icon: FaFileImage, color: 'orange' },
  zip: { icon: FaFileArchive, color: '#ff9900' },
  tar: { icon: FaFileArchive, color: '#ff9900' },
  rar: { icon: FaFileArchive, color: '#ff9900' },
};

export const getFileIcon = (fileName: string): React.ReactNode => {
  if(fileName.endsWith("/")) {
    const { icon: Icon, color } = extensionToIconMap['folder'];
    return <Icon color={color} size={16} />;
  }
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
    if (exactFileNameMap[fileName]) {
      const { icon: Icon, color } = exactFileNameMap[fileName];
      return <Icon color={color} size={16} />;
    }
  
    if (ext in extensionToIconMap) {
      const { icon: Icon, color } = extensionToIconMap[ext as keyof typeof extensionToIconMap];
      return <Icon color={color} size={16} />;
    }
  
    return <FaFile color="#888" size={16} />;
  };
  