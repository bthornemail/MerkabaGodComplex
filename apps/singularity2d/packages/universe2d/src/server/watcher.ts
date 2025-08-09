import DirectedGraph from 'graphology';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs/promises';

type NodeAttributes = {
    type: 'file' | 'directory';
    content?: string;
    path: string;
    createdAt: Date;
    updatedAt: Date;
};

type ObsidianVaultOptions = {
    vaultPath: string;
    vaultName: string;
    useVaultId?: boolean;
    autoWatch?: boolean;
};

export class ObsidianVaultGraph {
    private graph: DirectedGraph<NodeAttributes>;
    private watcher: any;
    private vaultId?: string;

    constructor(private options: ObsidianVaultOptions) {
        this.graph = new DirectedGraph<NodeAttributes>();

        this.watcher = chokidar.watch(options.vaultPath, {
            ignored: /(^|[/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: !options.autoWatch,
        });

        if (options.autoWatch) {
            this.setupWatcher();
        }
    }

    public async initialize() {
        await this.buildInitialGraph();
        this.setupWatcher();
    }

    private async buildInitialGraph() {
        await this.processDirectory(this.options.vaultPath);
    }

    private async processDirectory(dirPath: string) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                await this.addDirectoryNode(fullPath);
                await this.processDirectory(fullPath);
            } else if (entry.isFile() && path.extname(entry.name) === '.md') {
                await this.addFileNode(fullPath);
            }
        }
    }

    private setupWatcher() {
        this.watcher
            .on('add', async (filePath: string) => this.handleFileAdd(filePath))
            .on('change', async (filePath: string) => this.handleFileChange(filePath))
            .on('unlink', async (filePath: string) => this.handleFileRemove(filePath))
            .on('addDir', async (dirPath: string) => this.handleDirAdd(dirPath))
            .on('unlinkDir', async (dirPath: string) => this.handleDirRemove(dirPath));
    }

    private async handleFileAdd(filePath: string) {
        if (path.extname(filePath) !== '.md') return;
        await this.addFileNode(filePath);
    }

    private async addFileNode(filePath: string) {
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');
try {
    
    this.graph.addNode(filePath, {
        type: 'file',
        content,
        path: filePath,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
    });

    this.linkToParent(filePath);
} catch (error) {
    
}
    }

    private async handleDirAdd(dirPath: string) {
        await this.addDirectoryNode(dirPath);
    }

    private async addDirectoryNode(dirPath: string) {
        const stats = await fs.stat(dirPath);
        try {

        this.graph.addNode(dirPath, {
            type: 'directory',
            path: dirPath,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
        });

        this.linkToParent(dirPath);
            
        } catch (error) {
            
        }
    }

    private linkToParent(childPath: string) {
        const parentPath = path.dirname(childPath);

        if (parentPath !== this.options.vaultPath && this.graph.hasNode(parentPath)) {
            this.graph.addDirectedEdge(parentPath, childPath);
        }
    }

    private async handleFileChange(filePath: string) {
        const content = await fs.readFile(filePath, 'utf-8');
        this.graph.updateNodeAttributes(filePath, (attr: any) => ({
            ...attr,
            content,
            updatedAt: new Date(),
        }));
    }

    private handleFileRemove(filePath: string) {
        this.graph.dropNode(filePath);
    }

    private handleDirRemove(dirPath: string) {
        this.graph.forEachNode((node, attributes) => {
            if (attributes.path.startsWith(dirPath)) {
                this.graph.dropNode(node);
            }
        });
    }

    public getNoteUri(notePath: string, action: 'open' | 'edit' = 'open'): string {
        const vaultParam = this.options.useVaultId && this.vaultId
            ? `vault=${encodeURIComponent(this.vaultId)}`
            : `path=${encodeURIComponent(this.options.vaultPath)}`;

        const relativePath = path.relative(this.options.vaultPath, notePath);
        const fileParam = `file=${encodeURIComponent(relativePath.replace(/\.md$/, ''))}`;

        return `obsidian://${action === 'open' ? 'open' : 'new'}?${vaultParam}&${fileParam}`;
    }

    public async createNote(notePath: string, content: string = ''): Promise<void> {
        const fullPath = path.join(this.options.vaultPath, notePath);
        await fs.writeFile(fullPath, content);
        // The watcher will automatically detect the new file and update the graph
    }

    public findNotePath(targetContent: string): string | null {
        let foundPath: string | null = null;

        this.graph.forEachNode((node, attributes) => {
            if (attributes.type === 'file' && attributes.content?.includes(targetContent)) {
                foundPath = attributes.path;
            }
        });

        return foundPath;
    }

    public getNoteGraph(): DirectedGraph<NodeAttributes> {
        return this.graph;
    }

    public getNoteRelations(notePath: string): string[] {
        return this.graph.outNeighbors(notePath);
    }

    public async close() {
        await this.watcher.close();
    }
};
(async () => {
    const vaultPath: string = "/home/main/github/agent2d/public/src/docs"
    // Example usage
    const vault = new ObsidianVaultGraph({
        vaultPath,
        vaultName: 'My Vault',
        autoWatch: true,
    });

    await vault.initialize();

    // Get the graph representation
    const graph = vault.getNoteGraph();

    // Create a new note
    await vault.createNote('New Note.md', '# Hello World\nThis is a new note');

    // Get the Obsidian URI for a note
    const noteUri = vault.getNoteUri(`${vaultPath}/New Note.md`);
    console.log(noteUri); // obsidian://open?path=%2Fpath%2Fto%2Fyour%2Fvault&file=New%20Note
    
    // Find relationships
    const relatedNotes = vault.getNoteRelations(`${vaultPath}/Existing Note.md`);
    console.log(relatedNotes);
    console.log(graph.export());
})();