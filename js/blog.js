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
  
  // 监听搜索按钮点击
  document.querySelector('.search-box button').addEventListener('click', searchPosts);
  
  // 监听搜索输入框回车键
  document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchPosts();
    }
  });
  
  // 监听分类导航点击
  document.querySelectorAll('.category-list a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.category-list a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
      filterPostsByCategory(this.textContent);
    });
  });
});

// 搜索文章
function searchPosts() {
  const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
  fetchPosts(searchTerm);
}

// 按分类过滤文章
function filterPostsByCategory(category) {
  const filter = category === '全部' ? '' : category;
  fetchPosts('', filter);
}

// 获取文章列表
function fetchPosts(searchTerm = '', category = '') {
  let url = '/posts';
  const params = new URLSearchParams();
  
  if (searchTerm) params.append('q', searchTerm);
  if (category) params.append('category', category);
  
  if (params.toString()) url += `?${params.toString()}`;
  
  fetch(url)
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