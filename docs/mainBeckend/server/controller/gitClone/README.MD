# Git Clone Controller Documentation

## Overview

The Git Clone Controller is a Node.js/Express endpoint that imports GitHub repositories into a project management system. It handles the complete workflow of fetching a repository, processing its files, uploading media assets to Cloudinary, and storing the project structure in a database.

## Architecture

The controller uses a class-based streaming architecture that provides real-time progress updates to the client through Server-Sent Events (SSE).

### Key Components

- **GitCloneProcessor**: Main orchestrator class that manages the entire import workflow
- **StreamHelper**: Handles SSE communication with the client
- **File Processing Pipeline**: Handles text files, binary files, and media uploads
- **Database Integration**: Creates teams, projects, and file structures

## API Endpoint

### Request

**Method**: `POST`

**Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | The ID of the user initiating the import |
| `userAuth` | string | Yes | Encrypted GitHub personal access token |
| `ownerName` | string | Yes | GitHub repository owner username |
| `repoName` | string | Yes | GitHub repository name |
| `team` | string | Yes | JSON string of team members array |
| `project` | string | Yes | JSON string of project details object |
| `own` | string | No | Set to "true" to verify repo ownership |

**Team Member Object Structure**:
```json
{
  "userId": "user123",
  "role": "MEMBER"
}
```

**Project Object Structure**:
```json
{
  "name": "My Project",
  "description": "Project description",
  "type": "WEB_APP",
  "packages": "npm,react,typescript"
}
```

### Response

**Type**: Server-Sent Events (SSE) stream

**Event Data Structure**:
```typescript
{
  step: number,           // Current step (1-5)
  status: "start" | "done" | "error",
  message: string,        // Human-readable status message
  project?: string        // Project ID (only in final step)
}
```

## Processing Pipeline

The controller executes five distinct steps, each with progress reporting:

### Step 1: Validate and Prepare Data

**Purpose**: Validates incoming request data and authenticates the user

**Process**:
1. Decrypts the GitHub authentication token
2. Validates required fields (auth token, owner name, repo name)
3. Parses team and project JSON data
4. Verifies project details contain all 4 required fields
5. Fetches user from database
6. Optionally verifies repository ownership if `own=true`

**Error Conditions**:
- Invalid or missing authentication token
- Missing required GitHub repository details
- Incomplete project details
- User not found in database
- User is not the repository owner (when ownership check is required)

### Step 2: Fetch Repository

**Purpose**: Downloads the GitHub repository as a ZIP file

**Process**:
1. Initializes Octokit GitHub API client
2. Requests repository ZIP archive using GitHub's `/repos/{owner}/{repo}/zipball` endpoint
3. Downloads the ZIP file via the redirect URL
4. Validates file size against 50MB limit
5. Converts to Uint8Array for processing

**Error Conditions**:
- Repository not found or inaccessible
- ZIP download failed
- Repository exceeds 50MB size limit

### Step 3: Create Team and Project

**Purpose**: Establishes database records for the team and project

**Process**:
1. Creates a new team with the format `{projectName} Team`
2. Adds the initiating user as ADMIN
3. Adds additional team members with their specified roles (defaults to MEMBER)
4. Creates project record with:
   - Basic project details (name, description, type, packages)
   - Git repository reference (`owner\repo`)
   - Owner and team associations
   - Optional git import flags if user owns the repository
5. Rolls back team creation if project creation fails

**Error Conditions**:
- Database connection failure
- Team creation failed
- Project creation failed (triggers team cleanup)

### Step 4: Extract and Process Files

**Purpose**: Unzips repository and processes all files and folders

**Process**:
1. Unzips the repository archive
2. Strips the root folder prefix from all paths
3. Processes each entry:
   - **Folders**: Creates folder entries (skips empty root)
   - **Files**: Routes to appropriate handler based on file type

**File Processing Logic**:

#### Text Files
- Validated using null-byte check (`\x00`)
- Content stored directly as UTF-8 string
- Invalid text files converted to `.txt` with "binary data" message

#### Media Files (Images/Videos/Audio)
- **Supported formats**: 
  - Images: png, jpg, jpeg, gif, webp
  - Videos: mp4, mov, avi, mkv, webm
  - Audio: mp3, wav, ogg
- Empty files are skipped with explanatory message
- Uploaded to Cloudinary in `/projects/{projectId}` folder
- Cloudinary URL stored as file content
- Upload failures create `.txt` file with error message
- Successfully uploaded assets tracked for potential cleanup

#### Documents
- **Supported formats**: pdf, docx, pptx, xlsx
- Uploaded to Cloudinary as `raw` resource type
- Cloudinary URL stored as file content

#### Binary Files
- **Formats**: exe, dll, so, bin, zip, rar, tar, 7z
- Skipped entirely
- Creates `.txt` placeholder with skip message

**Error Conditions**:
- Unzip operation failed
- Cloudinary upload failures (handled gracefully per-file)
- File processing errors

### Step 5: Upload to Database

**Purpose**: Creates database records for all folders and files

**Process**:
1. Sorts folders by depth (shallowest first)
2. Creates folder records sequentially, building a path-to-ID map
3. Establishes parent-child relationships using the path map
4. Creates file records in batches of 10
5. Resolves parent folder IDs for nested files
6. Returns project ID upon successful completion

**Batch Processing**:
- Files are uploaded in chunks of 10 to prevent overwhelming the database
- Each batch is processed with `Promise.all` for parallel execution within the batch

**Error Conditions**:
- Database write failures
- Parent folder not found (orphaned files)
- Transaction failures (triggers full cleanup)

## Configuration Constants

### File Type Classifications

```typescript
FILE_EXTENSIONS = {
  IMAGE: ["png", "jpg", "jpeg", "gif", "webp"],
  VIDEO: ["mp4", "mov", "avi", "mkv", "webm"],
  AUDIO: ["mp3", "wav", "ogg"],
  DOCUMENT: ["pdf", "docx", "pptx", "xlsx"],
  BINARY: ["exe", "dll", "so", "bin", "zip", "rar", "tar", "7z"]
}
```

### Limits

- **MAX_REPO_SIZE**: 50MB (52,428,800 bytes)
- **FILE_UPLOAD_BATCH_SIZE**: 10 files per batch

## Error Handling

The controller implements comprehensive error handling at each step:

### Error Response Pattern
```typescript
{
  step: number,
  status: "error",
  message: "Description of error"
}
```

### Cleanup on Failure

When errors occur after database records are created:

1. **After Project Creation**: Deletes project, team, and all uploaded Cloudinary assets
2. **During File Upload**: Deletes file items, project, team, and Cloudinary assets
3. **Cloudinary Assets**: Tracked throughout process and cleaned up on any failure

### Error Recovery

- Team creation failure: No cleanup needed (no records created)
- Project creation failure: Deletes team
- File processing failure: Full cleanup of team, project, and media uploads
- Database write failure: Full cleanup of all created resources

## Database Schema Requirements

### User Table
- `id`: Primary key
- `fullName`: User's full name
- `username`: Username
- `email`: Email address

### Team Table
- `id`: Primary key
- `name`: Team name
- `type`: Team type enum (e.g., "PRIVATE")
- `members`: Relation to team members

### TeamMember Table
- Joins User and Team
- `role`: Member role (e.g., "ADMIN", "MEMBER")

### Project Table
- `id`: Primary key
- `name`: Project name
- `gitRepo`: Repository reference
- `description`: Project description
- `type`: Project type
- `packages`: Package list
- `ownerId`: Foreign key to User
- `teamId`: Foreign key to Team
- `isGitImport`: Boolean flag
- `gitKey`: Encrypted Git credentials (optional)

### FileItem Table
- `id`: Primary key
- `type`: "file" or "folder"
- `name`: File/folder name
- `content`: File content or Cloudinary URL
- `projectId`: Foreign key to Project
- `parentId`: Self-referential foreign key for nested structure

## External Dependencies

### GitHub API (Octokit)
- **Purpose**: Fetch repository archives
- **Authentication**: Personal access token
- **Endpoints Used**: 
  - `GET /repos/{owner}/{repo}/zipball`
  - `GET /user`
  - `GET /repos/{owner}/{repo}`

### Cloudinary
- **Purpose**: Store media and document files
- **Functions Used**:
  - `uploadToCloudinary()`: Upload files
  - `cleanupCloudinaryFiles()`: Delete on error
- **Folder Structure**: `/projects/{projectId}/`

### fflate
- **Purpose**: ZIP file extraction
- **Functions Used**:
  - `unzipSync()`: Extract ZIP archive
  - `strFromU8()`: Convert Uint8Array to string

## Security Considerations

1. **Authentication**: GitHub tokens are encrypted in transit and decrypted server-side
2. **Authorization**: Optional ownership verification prevents unauthorized imports
3. **Validation**: All input parameters validated before processing
4. **Size Limits**: 50MB repository size limit prevents memory exhaustion
5. **File Type Restrictions**: Binary executables are skipped to prevent security risks

## Usage Example

### Client-Side Request

```javascript
const formData = new FormData();
formData.append('userId', 'user123');
formData.append('userAuth', encryptedToken);
formData.append('ownerName', 'octocat');
formData.append('repoName', 'Hello-World');
formData.append('team', JSON.stringify([
  { userId: 'user456', role: 'MEMBER' }
]));
formData.append('project', JSON.stringify({
  name: 'Hello World Project',
  description: 'A sample project',
  type: 'WEB_APP',
  packages: 'npm,node'
}));
formData.append('own', 'true');

const eventSource = new EventSource('/api/git/clone');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`Step ${data.step}: ${data.message}`);
  
  if (data.status === 'done' && data.project) {
    console.log('Project created:', data.project);
    eventSource.close();
  }
};
```

### Expected Event Stream

```
data: {"step":1,"status":"start","message":"Checking Incoming data"}

data: {"step":1,"status":"done","message":"Checked Incoming Data"}

data: {"step":2,"status":"start","message":"Looking For Repo"}

data: {"step":2,"status":"done","message":"Found Repo"}

data: {"step":3,"status":"start","message":"Project Making"}

data: {"step":3,"status":"done","message":"Project made"}

data: {"step":4,"status":"start","message":"Checking Data in the repo"}

data: {"step":4,"status":"done","message":"Repo Processed Going To make project"}

data: {"step":5,"status":"start","message":"Copying data"}

data: {"step":5,"status":"done","message":"Copied Data","project":"proj_abc123"}
```
