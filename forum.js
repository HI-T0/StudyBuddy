export function initForum() {
    const forumPostForm = document.getElementById('forum-post-form');
    const forumPosts = document.getElementById('forum-posts');

    let posts = JSON.parse(localStorage.getItem('forum-posts')) || [];

    function renderPosts() {
        forumPosts.innerHTML = '';
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button onclick="deletePost(${index})">Delete</button>
            `;
            forumPosts.appendChild(postElement);
        });
    }

    forumPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        posts.push({ title, content });
        localStorage.setItem('forum-posts', JSON.stringify(posts));
        forumPostForm.reset();
        renderPosts();
    });

    window.deletePost = (index) => {
        posts.splice(index, 1);
        localStorage.setItem('forum-posts', JSON.stringify(posts));
        renderPosts();
    };

    renderPosts();
}