const apiUrl = "https://api.spaceflightnewsapi.net/v4/articles/";
let newsList = [];
let editId = null;

function setMessage(text) {
  document.getElementById("message").textContent = text;
}

function showNews() {
  let html = "";
  for (let item of newsList) {
    html += `<div class="card">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <p>Source: ${item.site}</p>
      <button onclick="startEdit(${item.id})">Edit</button>
      <button class="red" onclick="removeArticle(${item.id})">DELETE: Remove</button>
    </div>`;
  }
  document.getElementById("list").innerHTML = html;
}

function loadNews() {
  const word = document.getElementById("search").value;
  setMessage("Loading...");
  fetch(apiUrl + "?limit=10&search=" + encodeURIComponent(word))
    .then(res => res.json())
    .then(data => {
      newsList = data.results.map(a => ({
        id: a.id,
        title: a.title,
        text: a.summary,
        site: a.news_site
      }));
      showNews();
      setMessage("GET: " + newsList.length + " articles loaded");
      console.log("GET", newsList);
    })
    .catch(() => setMessage("Error: could not load news"));
}

function addArticle() {
  const title = document.getElementById("title").value;
  const text = document.getElementById("text").value;
  if (title == "" || text == "") {
    setMessage("Please fill title and description");
    return;
  }
  const article = { id: Date.now(), title: title, text: text, site: "Added by me" };
  newsList.unshift(article);
  showNews();
  setMessage("POST: article added");
  console.log("POST", article);
  document.getElementById("title").value = "";
  document.getElementById("text").value = "";
}

function startEdit(id) {
  const article = newsList.find(a => a.id == id);
  editId = id;
  document.getElementById("title").value = article.title;
  document.getElementById("text").value = article.text;
  setMessage("Now change the text and press PUT");
}

function updateArticle() {
  if (editId == null) {
    setMessage("First press Edit on an article");
    return;
  }
  const article = newsList.find(a => a.id == editId);
  article.title = document.getElementById("title").value;
  article.text = document.getElementById("text").value;
  showNews();
  setMessage("PUT: article updated");
  console.log("PUT", article);
  editId = null;
  document.getElementById("title").value = "";
  document.getElementById("text").value = "";
}

function removeArticle(id) {
  newsList = newsList.filter(a => a.id != id);
  showNews();
  setMessage("DELETE: article removed");
  console.log("DELETE", id);
}
