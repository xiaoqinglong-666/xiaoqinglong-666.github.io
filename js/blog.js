// 初始化博客功能
document.addEventListener('DOMContentLoaded', function() {
  // 加载文章列表
  fetchPosts();
  
  // 监听文章点击事件
  document.querySelector('.post-list').addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      loadPost(e.target.dataset.id);
    }
  });
});

// 获取文章列表
function fetchPosts() {
  fetch('/posts')
    .then(response => response.json())
    .then(posts => renderPostList(posts))
    .catch(error => console.error('Error:', error));
}

// 渲染文章列表
function renderPostList(posts) {
  const listEl = document.querySelector('.post-list');
  listEl.innerHTML = posts.map(post => 
    `<li><a href="#" data-id="${post.id}">${post.title}</a></li>`
  ).join('');
}

// 加载单篇文章
function loadPost(postId) {
  fetch(`/posts/${postId}`)
    .then(response => response.text())
    .then(markdown => {
      // 使用marked.js解析Markdown
      document.querySelector('.post-content').innerHTML = marked.parse(markdown);
    })
    .catch(error => console.error('Error:', error));
}