import { Input } from '@/components/ui/input';
import React from 'react';
import { z } from 'zod';

// Your given regex + schema
const FILE_NAME_PATTERNS = {
    basic: /^[a-zA-Z0-9._-]+$/,
    noLeadingTrailing: /^(?!\.)(?!.*\.$)(?!\s)(?!.*\s$).+$/,
    validExtensions: /\.(js|ts|jsx|tsx|html|css|scss|sass|less|json|md|txt|py|java|cpp|c|h|hpp|php|rb|go|rs|rust|swift|kt|dart|vue|svelte|xml|yml|yaml|toml|ini|cfg|conf|config|log|sql|sh|bash|zsh|bat|ps1|dockerfile|gitignore|gitattributes|env|sample|example|template|lock|min|map|woff|woff2|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|tar|gz|rar|7z|bak|tmp|cache|dist|build)$/i,
    folder: /^[a-zA-Z][a-zA-Z0-9._/-]*$/,
    reserved: /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
};

const renameSchema = z.object({
    id: z.string().cuid('Invalid file item ID'),
    name: z.string()
        .min(1, 'Name cannot be empty')
        .max(255, 'Name too long (max 255 characters)')
        .refine(
            (name) => FILE_NAME_PATTERNS.noLeadingTrailing.test(name),
            'Name cannot start or end with dots or spaces'
        )
        .refine(
            (name) => !FILE_NAME_PATTERNS.reserved.test(name.split('.')[0]),
            'Name cannot be a reserved system name'
        ),
    type: z.enum(['file', 'folder']).optional()
});

export default function InputBox({ id, type, Name="", handleNameConfirm ,projectId=null,setIsFileAction}: any) {
    const [name, setName] = React.useState(Name);
    const [error, setError] = React.useState('');

    const formSubmit = (e: any) => {
        e.preventDefault();
            // Validate using Zod schema
            const validation = renameSchema.safeParse({ id, name, type });
            if (!validation.success) {
                setError(validation.error.errors[0].message);
                return;
            }
            if (type === 'folder') {
                if (!FILE_NAME_PATTERNS.folder.test(name)) {
                    setError('Name should be proper');
                    return;
                }
                if (name.includes('.')) {
                    setError('Folder names should not contain file extensions');
                    return;

                }
            } else if (type == "file") {
                if (!FILE_NAME_PATTERNS.basic.test(name)) {
                    setError('Name should be proper');
                    return;
                }
                if (!FILE_NAME_PATTERNS.validExtensions.test(name)) {

                    setError('File must have a valid extension');
                    return
                }
               
            }
            setError('');
            if(projectId){
                handleNameConfirm(type,id,name)
            }else{
            handleNameConfirm(id,name); // Run your confirm function
            }
setIsFileAction(false);
        
    };

    return (
        <form onSubmit={formSubmit}>
            <Input
                type="text"
                value={type==="folder"?name.slice(0,-1):name}
                onChange={(e) => {
                    setName(type==="folder"?e.target.value+"/":e.target.value);
                }}
                
                autoFocus
            />
            {error && <div style={{ color: 'red', fontSize: '0.8em' }}>{error}</div>}
        </form>
    );
}
