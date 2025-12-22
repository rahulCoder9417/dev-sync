import { Tab } from "../types/codeEditor";


export const getLanguage = (name: string): string => {
    const ext = name.toLowerCase().split('.').pop() || '';

    const map: Record<string, string> = {
      js: 'javascript', jsx: 'javascript',
      ts: 'typescript', tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp', c: 'cpp', h: 'cpp', hpp: 'cpp',
      rb: 'ruby',
      go: 'go',
      rs: 'rust', rust: 'rust',
      swift: 'swift',
      kt: 'kotlin',
      dart: 'dart',
      html: 'html',
      css: 'css', scss: 'scss', sass: 'scss', less: 'less',
      json: 'json',
      md: 'markdown',
      txt: 'plaintext',
      xml: 'xml',
      yml: 'yaml', yaml: 'yaml',
      toml: 'toml',
      ini: 'ini', cfg: 'ini', conf: 'ini',
      sql: 'sql',
      sh: 'shell', bash: 'shell', zsh: 'shell',
      bat: 'bat',
      ps1: 'powershell',
      dockerfile: 'dockerfile',
      gitignore: 'gitignore',
      env: 'dotenv', sample: 'dotenv', example: 'dotenv', template: 'dotenv',
      lock: 'plaintext', min: 'plaintext', map: 'plaintext',
      vue: 'vue',
      svelte: 'svelte',
    };

    const binaryExtensions = new Set([
      'woff', 'woff2', 'ttf', 'otf', 'eot',
      'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
      'pdf', 'zip', 'tar', 'gz', 'rar', '7z',
      'bak', 'tmp', 'cache', 'dist', 'build'
    ]);
    if (binaryExtensions.has(ext)) return 'plaintext';

    return map[ext] || 'plaintext';
  };

  const SUPPORTED_EXTS = {
    images: ["png", "jpg", "jpeg", "gif", "webp"],
    videos: ["mp4", "mov", "webm"],
    audio: ["mp3", "wav", "ogg"],
    docs: ["pdf"]
  };

  export const checkNotEditor = (name: string) => {
    const ext = name?.split(".").pop()!.toLowerCase();
    if(!ext) return
    if (SUPPORTED_EXTS.images.includes(ext)) return "image";
    if (SUPPORTED_EXTS.videos.includes(ext)) return "video";
    if (SUPPORTED_EXTS.audio.includes(ext)) return "audio";
    if (SUPPORTED_EXTS.docs.includes(ext)) return "doc";
  }