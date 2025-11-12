import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';

// --- CÁC HÀM XỬ LÝ CHÍNH ---

/**
 * Tạo file mới trong GitHub repository
 */
async function createFilesInGitHub(navbarId, label, octokit, owner, repo, baseCommitSha, baseTreeSha) {
    // Nội dung file _category_.json (Quan trọng cho Plugin Docs)
    const categoryJsonContent = JSON.stringify(
        {
            label: label,
            position: 999,
            link: { type: 'generated-index' },
        },
        null,
        2
    );

    // Nội dung file intro.md
    const introMdContent = `---
title: Introduction to ${label}
sidebar_position: 1
---

# ${label}

Welcome to ${label}! This is the introduction page.
`;

    // Nội dung file navbar.json metadata (cho Docusaurus Config)
    const navbarJsonContent = JSON.stringify(
        {
            id: navbarId,
            label: label,
            to: `/docs/${navbarId}/intro`,
            type: 'docSidebar',
            sidebarId: navbarId,
            position: 'left',
            order: 999,
        },
        null,
        2
    );

    // 1. Kiểm tra folder docs đã tồn tại chưa (Nếu có, throw lỗi 409)
    try {
        await octokit.repos.getContent({ owner, repo, path: `docs/${navbarId}/intro.md` });
        throw new Error('Navbar folder already exists');
    } catch (err) {
        if (err.status !== 404) {
            throw err;
        }
    }

    // 2. Tạo Tree với các file mới
    const files_to_create = [
        { // File cấu hình cho Docs Plugin
            path: `docs/${navbarId}/_category_.json`,
            mode: '100644',
            type: 'blob',
            content: categoryJsonContent,
        },
        { // Trang intro mặc định
            path: `docs/${navbarId}/intro.md`,
            mode: '100644',
            type: 'blob',
            content: introMdContent,
        },
        { // File metadata Navbar (Được docusaurus.config.js đọc)
            path: `data/navbars/${navbarId}.json`,
            mode: '100644',
            type: 'blob',
            content: navbarJsonContent,
        },
    ];

    const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        tree: files_to_create,
    });

    // 3. Tạo Commit
    const { data: commitCreateData } = await octokit.git.createCommit({
        owner,
        repo,
        message: `feat(docs): create navbar "${label}" (${navbarId})`,
        tree: treeData.sha,
        parents: [baseCommitSha],
    });

    // 4. Update Reference
    await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${repoData.default_branch}`,
        sha: commitCreateData.sha,
    });

    return {
        success: true,
        message: `Created navbar "${label}" and pushed to GitHub`,
        commitSha: commitCreateData.sha,
    };
}

/**
 * Xóa file và folder khỏi GitHub repository
 */
async function deleteFilesFromGitHub(navbarId, octokit, owner, repo, baseCommitSha, baseTreeSha) {
    // 1. Lấy Tree mới nhất
    const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        // Đặt file path thành null để xóa các file và folder
        tree: [
            { path: `docs/${navbarId}/_category_.json`, mode: '100644', type: 'blob', sha: null },
            { path: `docs/${navbarId}/intro.md`, mode: '100644', type: 'blob', sha: null },
            { path: `data/navbars/${navbarId}.json`, mode: '100644', type: 'blob', sha: null },
        ],
    });

    // 2. Tạo Commit
    const { data: commitCreateData } = await octokit.git.createCommit({
        owner,
        repo,
        message: `feat(docs): delete navbar "${navbarId}"`,
        tree: treeData.sha,
        parents: [baseCommitSha],
    });

    // 3. Update Reference
    await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${repoData.default_branch}`,
        sha: commitCreateData.sha,
    });

    return {
        success: true,
        message: `Deleted navbar "${navbarId}" and pushed to GitHub`,
        commitSha: commitCreateData.sha,
    };
}


// --- HÀM XỬ LÝ SERVERLESS FUNCTION (Handler) ---

export default async function handler(req, res) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
        return res.status(500).json({ error: 'GitHub credentials missing in Vercel Environment Variables.' });
    }

    const octokit = new Octokit({ auth: token });

    try {
        // Lấy thông tin commit mới nhất (cần cho mọi thao tác Git)
        const { data: repoData } = await octokit.repos.get({ owner, repo });
        const defaultBranch = repoData.default_branch;
        const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${defaultBranch}` });
        const baseCommitSha = refData.object.sha;
        const { data: commitData } = await octokit.git.getCommit({ owner, repo, commit_sha: baseCommitSha });
        const baseTreeSha = commitData.tree.sha;

        if (req.method === 'GET') {
            // Lấy danh sách Navbar (sử dụng logic trong API/navbars.js của bạn)
            const { data: contents } = await octokit.repos.getContent({ owner, repo, path: 'data/navbars' });

            const navbarFiles = contents.filter(item => item.type === 'file' && item.name.endsWith('.json'));
            const navbars = await Promise.all(navbarFiles.map(async (file) => {
                const { data: fileData } = await octokit.repos.getContent({ owner, repo, path: file.path });
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                return JSON.parse(content);
            }));
            
            // Thêm các mục Docs/Blog mặc định (để hiển thị trên giao diện quản lý)
            navbars.push({ id: 'docs', label: 'Docs', type: 'docSidebar', position: 'left', order: 1000, locked: true });
            navbars.push({ id: 'blog', label: 'Blog', type: 'link', position: 'left', order: 1001, locked: true });
            
            return res.status(200).json(navbars.sort((a, b) => a.order - b.order));
        } 
        
        else if (req.method === 'POST') {
            // Tạo Navbar
            const { id, label } = req.body;
            const result = await createFilesInGitHub(id, label, octokit, owner, repo, baseCommitSha, baseTreeSha);
            return res.status(201).json(result);
        } 
        
        else if (req.method === 'DELETE') {
            // Xóa Navbar
            const { id } = req.body;
            const result = await deleteFilesFromGitHub(id, octokit, owner, repo, baseCommitSha, baseTreeSha);
            return res.status(200).json(result);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('already exists')) {
            return res.status(409).json({ error: 'Navbar already exists' });
        }
        return res.status(500).json({ error: errorMessage });
    }
}