import { currentUser } from '@clerk/nextjs/server';
import { Octokit } from '@octokit/core';
import { unzipSync, strFromU8 } from 'fflate';
const encoder = new TextEncoder();
import db from "@/lib/db/prisma"
import { cleanupCloudinaryFiles, UploadedAsset, uploadToCloudinary } from '@/lib/mainUtils/cloudinary';


export async function POST(req: Request) {
  const user = await currentUser();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true
    },
  });
  if (!dbUser) {
    throw new Error("User not found");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        const json = JSON.stringify(obj);
        controller.enqueue(encoder.encode(`data: ${json}\n\n`));
      };
      let userAuth, ownerName, repoName, projectRes, team, zipUint8Array, project, folder = [], fileContents: { path: string; content: string | null; type: string }[] = [];;
      // Step 1 operation data incoming check
      try {

        send({ step: 1, status: "start", message: "Checking Incomin data" });
        const formData = await req.formData();

        userAuth = formData.get('userAuth')?.toString();
        ownerName = formData.get('ownerName')?.toString();
        repoName = formData.get('repoName')?.toString();

        team = JSON.parse(formData.get('team')?.toString() || "[]")
        project = JSON.parse(formData.get('project')?.toString() || "{}")

        if (!userAuth || !ownerName || !repoName) {
          throw new Error("Missing GitHub auth token,and git repo details - 400")
        }
        if (Object.keys(project).length < 4) {
          throw new Error("Missing project details - 400")
        }
        send({ step: 1, status: "done", message: "Checked Incoming Data" });
      } catch (err) {
        send({ step: 1, status: "error", message: `Incoming Data  error: ${(err as Error).message}` });
        controller.close();
        return
      }

      // Step 2 getting git details
      try {
        send({ step: 2, status: "start", message: "Looking For Repo" });
        const octokit = new Octokit({ auth: userAuth });
        const response = await octokit.request('GET /repos/{owner}/{repo}/zipball', {
          owner: ownerName,
          repo: repoName,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        if (!response?.url) {
          throw new Error("GitHub repo not found or inaccessible 404")
        }
        const zipRes = await fetch(response.url);
        if (!zipRes.ok) {
          throw new Error("GitHub ZIP download failed 502")
        }
        const zipArrayBuffer = await zipRes.arrayBuffer();
        zipUint8Array = new Uint8Array(zipArrayBuffer);

        if (zipArrayBuffer.byteLength > 50 * 1024 * 1024) { // 50MB
          throw new Error("Repo too large to process in-memory 413")
        }
        send({ step: 2, status: "done", message: "Found Repo" });
      } catch (err) {
        send({ step: 2, status: "error", message: `Repo Finding Error : ${(err as Error).message}` });
        controller.close();
        return
      }

      // Step 3 db team and project making
      try {
        send({ step: 3, status: "start", message: "Project Making" });
        //team making
        const teamRes = await db.team.create({
          data: {
            name: `${project.name} Team`,
            type: "PRIVATE",
            members: {
              create: [
                {
                  user: { connect: { id: dbUser.id } },
                  role: "ADMIN",
                },
                ...team.map((i: any) => ({
                  user: { connect: { id: i.userId } },
                  role: i.role || "MEMBER", // fallback if role isn't provided
                })),
              ],
            },
          },
        });


        //project Making
        projectRes = await db.project.create({
          data: {
            name: project.name,
            gitRepo: `${ownerName}\\${repoName}`,
            description: project.description || "",
            type: project.type,
            packages: project.packages,
            ownerId: dbUser.id,
            teamId: teamRes.id,
          },
        });

        if (!projectRes) {
          team.id && await db.team.deleteMany({ where: { id: team.id } })
          throw new Error("Project making error - 400")
        }
        send({ step: 3, status: "done", message: "Project made" });
      } catch (err) {
        send({ step: 3, status: "error", message: `Project Making  error: ${(err as Error).message}` });
        controller.close();
        return
      }

      // Step 4 Extract zip in memory using fflate
      const uploadedAssets:UploadedAsset[] = [];

      try {
        send({ step: 4, status: "start", message: "Checking Data in th repo" });

        const extractedFiles = unzipSync(zipUint8Array as Uint8Array<ArrayBuffer>); // key: path, value: Uint8Array

        // Define video extensions
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
        const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        const audioExts = ['mp3', 'wav', 'ogg'];
        const docExts = ['pdf', 'docx', 'pptx', 'xlsx', ];

// Binary formats that should never go into the DB as text
const binaryOnlyExts = ['exe', 'dll', 'so', 'bin', 'zip', 'rar', 'tar', '7z'];
        // Helper: get file extension
        const getExt = (name: string) => name.split('.').pop()?.toLowerCase() || '';

        // Helper: determine Cloudinary resource type
        const getResourceType = (ext: string): 'image' | 'video' |"bin"| 'raw' | null => {
          if (imageExts.includes(ext)) return 'image';
          if (videoExts.includes(ext) || audioExts.includes(ext)) return 'video';
          if (docExts.includes(ext)) return 'raw';
          if (binaryOnlyExts.includes(ext)) return 'bin';
          return null;
        };
        for (const i in extractedFiles) {
          const isFolder = i.endsWith('/');
          const rootPrefix = i.split('/')[0] + '/';
          const filename = i.startsWith(rootPrefix) ? i.slice(rootPrefix.length) : i;
          if (isFolder) {
            if (filename === '') continue;
            folder.push({
              path: filename,
              type: 'folder',
              content: null,
            });
            continue;
          }


          const resourceType = getResourceType(getExt(i));
          if (resourceType) {
            const buffer = extractedFiles[i];
            if (!buffer || buffer.length === 0) {
              fileContents.push({
                path: filename,
                type: 'file',
                content: `Skipped empty file: ${filename}`,
              });
              continue;
            }
            if (resourceType==="bin") {
              fileContents.push({
                path: filename.replace(/\.[^/.]+$/, '') + '.txt',
                type: 'file',
                content: `Skipped bin file: ${filename}`,
              });
              continue;
            }
            try {
              const uploadRes = await uploadToCloudinary({
                buffer,
                filename: filename,
                folder: "/projects/" + projectRes.id,
                type: resourceType,
              });
              fileContents.push({
                path: filename.replace(/\.[^/.]+$/, '') + '.txt',
                type: 'file',
                content: uploadRes.secure_url,
              });

              uploadedAssets.push({ public_id: uploadRes.public_id, resource_type: resourceType });
            } catch (err) {
              fileContents.push({
                path: filename.replace(/\.[^/.]+$/, '') + '.txt',
                type: 'file',
                content: `Upload failed: ${(err as Error).message}`,
              });
            }
          } else {
            const isvalid =!/\x00/.test(strFromU8(extractedFiles[i]))
            fileContents.push({
              path: isvalid? filename:filename.replace(/\.[^/.]+$/, '') + '.txt',
              type: 'file',
              content: isvalid ? strFromU8(extractedFiles[i]):"Skipped because of binary data",
            });
          }
        }
        send({ step: 4, status: "done", message: "Repo Procssed Going To mske project" });
      } catch (err) {
        send({ step: 4, status: "error", message: `Repo PRocessing  error: ${(err as Error).message}` });
        controller.close();
        return
      }



      // Step 5 file uploading
      try {
        send({ step: 5, status: "start", message: "Copying data" });
        //file Uploading
        //  items ->public/index.js
        //  items ->public/ ->folder
        let pathToIdMap = new Map<string, string>();

        for (const i of folder) {
          const pathPart = i.path.split('/').filter(Boolean)

          const name = pathPart[pathPart.length - 1] + "/";
          const parentPath = pathPart.slice(0, -1).length === 0 ? null : pathPart.slice(0, -1).join('/') + "/";

          const res = await db.fileItem.create({
            data: {
              type: "folder",
              name,
              content: '',
              projectId: projectRes.id,
              parentId: parentPath ? pathToIdMap.get(parentPath) : null,
            },
          });
          pathToIdMap.set(i.path, res.id)
        }
        //  upload in batches of 10
        for (let i = 0; i < fileContents.length; i += 10) {
          const chunk = fileContents.slice(i, i + 10);
          await Promise.all(chunk.map(async (item) => {
            let pathParts = [item.path];
            if (item.path.includes("/")) {
              pathParts = item.path.split('/').filter(Boolean);
            }

            const name = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join('/') + "/";
            let parentId: string | null | undefined = null;

            if (parentPath !== "/") {
              parentId = pathToIdMap.get(parentPath);
            }
            await db.fileItem.create({
              data: {
                type: item.type,
                name,
                content: item.content || '',
                projectId: projectRes.id,
                parentId,
              },
            });
          }))
        }


        send({ step: 5, project: projectRes.id, status: "done", message: "Copied Data " });
      } catch (err) {

        // Cleanup
        await db.fileItem.deleteMany({ where: { projectId: projectRes.id } });
        await db.project.delete({ where: { id: projectRes.id } });
        await cleanupCloudinaryFiles(uploadedAssets)

        send({ step: 5, status: "error", message: `Copying error: ${(err as Error).message}` });
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    }
  });
}
